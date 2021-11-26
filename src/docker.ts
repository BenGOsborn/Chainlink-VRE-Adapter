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
    docker: Docker;
    TIMEOUT: number = 2; // Timeout in seconds

    // Initialize the client
    constructor() {
        this.docker = new Docker({ socketPath: "/var/run/docker.sock" }); // This needs to be exposed to the container it is run it
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
    async runCode(version: version, packages: string[], code: string) {
        // Start the container
        const exitIdentifier = crypto.randomBytes(32).toString("hex");
        const container = await this.docker.createContainer({
            Image: VERSIONS[version],
            Tty: true,
            Entrypoint: ["python3", "-c", `import time;time.sleep(${this.TIMEOUT});print('${exitIdentifier}')`, "&"],
        });
        container.start();

        // Setup environment
        const streamTimeout = await container.attach({ stream: true, stdout: true, stderr: true });
        const execs = [];
        const formattedPackages = packages.reduce((previous, current) => previous + "\n" + current, "");
        execs.push(container.exec({ Cmd: ["echo", formattedPackages, ">", "requirements.txt"], AttachStdin: true, AttachStdout: true }));
        execs.push(container.exec({ Cmd: ["pip3", "install", "-r", "requirements.txt"], AttachStdin: true, AttachStdout: true }));
        execs.push(container.exec({ Cmd: ["python3", "-c", code], AttachStdin: true, AttachStdout: true }));
        const toStart = await Promise.all(execs);
        toStart.slice(0, 2).forEach((exec) => exec.start({ hijack: true, stdin: true }));

        // Make a new promise to block the function from exiting and return the data
        const block = new Promise<string>(async (resolve, reject) => {
            // Record the data by the stream
            const dataRaw: any[] = [];

            // Record timeout message and terminate container
            streamTimeout.on("data", async (data) => {
                // Try is needed in case of the container has already stopped
                try {
                    await container.kill();
                    await container.stop();
                } catch {}

                // Reject the promise
                reject("Container timed out");
            });

            // Execute code and record data
            const streamData = await toStart[2].start({ hijack: true, stdin: true });
            streamData.on("data", async (data) => {
                // Append the chunk of data to the total data
                dataRaw.push(data);
            });
            streamData.on("end", async () => {
                // Get the exit code
                const exitCode = (await toStart[2].inspect()).ExitCode;

                // Try is needed in case of the container has already stopped
                try {
                    await container.kill();
                    await container.stop();
                } catch {}

                // Depending on the exit code reject or resolve the data
                if (exitCode === 0) {
                    const data = Buffer.concat(dataRaw).toString();
                    resolve(data.trim());
                }
                reject(`Container exited with exit code ${exitCode}`);
            });
        });
        return await block;
    }
}

(async function main() {
    // Initialize Docker utils
    const dockerUtils = new DockerUtils();

    // Test run the code
    const packages: string[] = [];
    const res = await dockerUtils.runCode("3.8.12", packages, "print(3)");
    console.log(res);
})()
    .then()
    .catch((error) => {
        console.log(error);
    });
