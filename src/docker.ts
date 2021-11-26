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
    TIMEOUT: number = 5; // Timeout in seconds

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
    async runCode(version: version, requirements: string[], code: string) {
        // Start the container
        const exitIdentifier = crypto.randomBytes(32).toString("hex");
        const finishedIdentifier = crypto.randomBytes(32).toString("hex");
        const container = await this.docker.createContainer({
            Image: VERSIONS[version],
            Tty: true,
            Entrypoint: ["python3", "-c", `import time;time.sleep(${this.TIMEOUT});print('${exitIdentifier}')`, "&"],
        });

        // Listen for events and return the data
        const data: any[] = [];
        let cleanExit = true;
        container.attach({ stream: true, stdout: true, stderr: true }, async (err, stream) => {
            // **** DEBUG LOGS
            stream?.pipe(process.stdout);

            // Setup environment and execute code
            const formattedRequirements = requirements.reduce((previous, current) => previous + "\n" + current, "");
            await container.exec({ Cmd: ["echo", formattedRequirements, ">", "requirements.txt"], AttachStdin: true, AttachStdout: true });
            await container.exec({ Cmd: ["pip3", "install", "-r", "requirements.txt"], AttachStdin: true, AttachStdout: true });
            await container.exec({ Cmd: ["python3", "-c", code], AttachStdin: true, AttachStdout: true });
            await container.exec({ Cmd: ["echo", finishedIdentifier], AttachStdin: true, AttachStdout: true });

            // Execute whenever data is output
            stream?.on("data", async (data) => {
                const trimmed = data.toString().trim();
                if (trimmed === exitIdentifier || trimmed === finishedIdentifier) {
                    // Set the exit status from the identifier
                    if (trimmed === finishedIdentifier) cleanExit = true;
                    // **** Means that if this got executed there is no clean exit
                    else cleanExit = false;

                    // Try is needed in case of the container has already stopped
                    try {
                        await container.kill();
                        await container.stop();
                        cleanExit = false;
                    } catch {}
                } else {
                    data.push(data);
                }
            });
        });
        container.start();

        // Return the data and status code
        if (cleanExit) {
            return [Buffer.concat(data).toString(), cleanExit];
        }
        return ["", cleanExit];
    }
}

(async function main() {
    // Initialize Docker utils
    const dockerUtils = new DockerUtils();

    // Test run the code
    const res = await dockerUtils.runCode("3.8.12", [], "print(3)");
    console.log(res);
})()
    .then()
    .catch((error) => {
        console.log(error);
    });
