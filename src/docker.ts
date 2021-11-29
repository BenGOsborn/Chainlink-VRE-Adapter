import Docker from "dockerode";
import fs from "fs";

// Declare the versions of Python
export interface JsonResponse {
    data: any;
}

// Utils for Docker
export default class DockerUtils {
    private docker: Docker;
    private timeout: number; // Timeout in seconds
    private versions: string[];
    private images: { [key: string]: string };

    // Initialize the client
    constructor(timeout: number, options?: Docker.DockerOptions) {
        // Initialize variables
        this.docker = new Docker(options);
        this.timeout = timeout;

        const file = fs.readFileSync("pyVersions.json", "utf8");
        this.images = JSON.parse(file);
        this.versions = Object.keys(this.images);
    }

    // Get all valid Python versions
    getSupportedVersions() {
        return this.versions;
    }

    // Check that a version of Python is supported
    isSupportedVersion(version: string) {
        return this.versions.filter((vsn) => vsn === version).length > 0;
    }

    // Start the Docker image and execute the commands
    async runCode(version: string, code: string, packages?: string[]) {
        // Start the container
        const container = await this.docker.createContainer({
            Image: this.images[version],
            Tty: true,
            Entrypoint: ["python3", "-c", `import time;time.sleep(${this.timeout});print('TIMEOUT')`, "&"],
        });
        container.start();
        const streamTimeout = await container.attach({ stream: true, stdout: true, stderr: true });

        // Setup environment
        if (packages && packages.length > 0) {
            const formattedPackages = packages.reduce((previous, current) => previous + current + "\n", "");
            const fileExec = await container.exec({ Cmd: ["ash", "-c", `echo -en '${formattedPackages}' > requirements.txt`], AttachStdin: true, AttachStdout: true });
            await fileExec.start({ hijack: true, stdin: true });

            const installExec = await container.exec({ Cmd: ["pip3", "install", "-r", "requirements.txt"], AttachStdin: true, AttachStdout: true });
            const streamInstall = await installExec.start({ hijack: true, stdin: true });
            try {
                await new Promise<void>(async (resolve, reject) => {
                    // Record timeout message and terminate container
                    streamTimeout.on("data", async () => {
                        // Try is needed in case of the container has already stopped
                        try {
                            await container.kill();
                        } catch {}

                        // Reject the promise
                        reject("Container timed out");
                    });

                    // Wait for the installation to of finished and check the logs
                    streamInstall.on("data", () => {}); // Needed to read stream
                    streamInstall.on("end", async () => {
                        // Get the exit code
                        const exitCode = (await installExec.inspect()).ExitCode;

                        // Depending on the exit code reject or resolve the data
                        if (exitCode === 0) resolve();
                        reject(`Container exited with exit code ${exitCode}`);
                    });
                });
            } catch (e) {
                throw Error(`'${e as string}' in packages`);
            }
        }

        // Make a new promise to block the function from exiting and return the data
        const codeExec = await container.exec({ Cmd: ["python3", "-c", code], AttachStdin: true, AttachStdout: true });
        const streamData = await codeExec.start({ hijack: true, stdin: true });
        try {
            return await new Promise<JsonResponse>(async (resolve, reject) => {
                // Record the data by the stream
                const dataRaw: any[] = [];

                // Record timeout message and terminate container
                streamTimeout.on("data", async () => {
                    // Try is needed in case of the container has already stopped
                    try {
                        await container.kill();
                    } catch {}

                    // Reject the promise
                    reject("Container timed out");
                });

                // Execute code and record data
                streamData.on("data", async (data) => {
                    dataRaw.push(data); // Append the chunk of data to the total data
                });
                streamData.on("end", async () => {
                    // Get the exit code
                    const exitCode = (await codeExec.inspect()).ExitCode;

                    // Try is needed in case of the container has already stopped
                    try {
                        await container.kill();
                    } catch {}

                    // Depending on the exit code reject or resolve the data
                    if (exitCode === 0) {
                        // Concat the bytes, remove all nonprintable characters, and return json
                        const raw = Buffer.concat(dataRaw)
                            .toString()
                            .replace(/[^ -~]+/g, "");
                        const json = JSON.parse(raw);
                        resolve(json);
                    }
                    reject(`Container exited with exit code ${exitCode}`);
                });
            });
        } catch (e) {
            throw Error(`'${e as string}' in code execution`);
        }
    }
}
