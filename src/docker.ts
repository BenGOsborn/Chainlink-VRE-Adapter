import Docker from "dockerode";
import crypto from "crypto";

// Declare the versions of Python
export type version = "3.8.12" | "3.9.9" | "3.10.0";
type versions = {
    [key in version]: string;
};
export const VERSIONS: versions = { "3.8.12": "python:3.8.12-alpine3.14", "3.9.9": "python:3.9.9-alpine3.14", "3.10.0": "python:3.10.0-alpine3.14" };

// Utils for Docker
export default class DockerUtils {
    private docker: Docker;
    private TIMEOUT: number = 120; // Timeout in seconds

    // Initialize the client
    constructor(options?: Docker.DockerOptions) {
        this.docker = new Docker(options);
    }

    // Check if the base image exists for the given Python version and if it doesnt pull it down
    async pullImage(version: version) {
        // Check that the version is valid
        if (Object.keys(VERSIONS).filter((vsion) => vsion === version).length === 0) throw Error("This version is not supported");

        // Get the list of images
        const images = await this.docker.listImages();

        // Pull the version if it does not exist
        const filtered = images.filter((image) => image.RepoTags[0] === VERSIONS[version]);
        if (filtered.length === 0) await this.docker.pull(VERSIONS[version]);
    }

    // Start the Docker image and execute the commands
    async runCode(version: version, code: string, packages?: string[]) {
        // Start the container
        const exitIdentifier = crypto.randomBytes(32).toString("hex");
        const container = await this.docker.createContainer({
            Image: VERSIONS[version],
            Tty: true,
            Entrypoint: ["python3", "-c", `import time;time.sleep(${this.TIMEOUT});print('${exitIdentifier}')`, "&"],
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
        }

        // Make a new promise to block the function from exiting and return the data
        const codeExec = await container.exec({ Cmd: ["python3", "-c", code], AttachStdin: true, AttachStdout: true });
        const streamData = await codeExec.start({ hijack: true, stdin: true });
        return await new Promise<string>(async (resolve, reject) => {
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
                // Append the chunk of data to the total data
                dataRaw.push(data);
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
                    const data = Buffer.concat(dataRaw).toString();
                    resolve(data.trim());
                }
                reject(`Container exited with exit code ${exitCode}`);
            });
        });
    }
}

(async function main() {
    // Initialize Docker utils
    const dockerUtils = new DockerUtils({ socketPath: "/var/run/docker.sock" });

    // Pull the version
    const version: version = "3.9.9";
    await dockerUtils.pullImage(version);

    // Run some test code
    const packages: string[] = ["requests==2.22.0"];
    const code = "import requests;print(requests.get('https://www.google.com/'))";
    const res = await dockerUtils.runCode(version, code, packages);

    // Log the result
    console.log(res);
})()
    .then()
    .catch((error) => {
        console.log(error);
    });
