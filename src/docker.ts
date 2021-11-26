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
    TIMEOUT: number = 1; // Timeout in seconds

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
        const container = await this.docker.createContainer({
            Image: VERSIONS[version],
            Tty: true,
            Entrypoint: ["python3", "-c", `import time;time.sleep(${this.TIMEOUT});print('${exitIdentifier}')`, "&"],
        });
        // python3 -c "import time;time.sleep(1);print('hello WORLD')" &
        container.attach({ stream: true, stdout: true, stderr: true }, (err, stream) => {
            stream?.pipe(process.stdout);
        });

        // **** One way I can go about doing this is by creating a cronjob initially that will run in the next expiry period, and then if we record that log we will record an error and exit with bad response

        // Start the container
        container.start();
        // await new Promise<void>((resolve) =>
        //     setTimeout(async () => {
        //         // Remove the container after a given amount of time if it has not finished
        //         try {
        //             await container.kill();
        //             await container.remove();
        //             console.log("Force killed container");
        //         } catch {
        //             console.log("No need for any form of force delete");
        //         }

        //         // Resolve the promise
        //         resolve();
        //     }, this.TIMEOUT)
        // );
    }
}

(async function main() {
    // Initialize Docker utils
    const dockerUtils = new DockerUtils();

    // Test run the code
    await dockerUtils.runCode("3.8.12", [], "print(3)");
})()
    .then()
    .catch((error) => {
        console.log(error);
    });
