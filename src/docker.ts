import Docker from "dockerode";

// Declare the versions of Python
export type version = "3.8.12" | "3.9.9" | "3.10.0";
type versions = {
    [key in version]: string;
};
export const VERSIONS: versions = { "3.8.12": "python:3.8.12-alpine3.14", "3.9.9": "python:3.9.9-alpine3.14", "3.10.0": "python:3.10.0-alpine3.14" };

// Utils for Docker
export default class DockerUtils {
    docker: Docker;
    TIMEOUT: number = 120 * 1000;

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
        if (filtered.length === 0) return await this.docker.pull(VERSIONS[version]);
    }

    // Start the Docker image and execute the commands
    async runCode(version: version, requirements: string, code: string) {
        await new Promise((resolve) =>
            setTimeout(() => {
                // Remove the container after a given amount of time

                // Resolve the promise **** HOW DO I DO THIS ???
                resolve;
            }, this.TIMEOUT)
        );
    }
}

(async function main() {
    const docker = new DockerUtils();
    const res = await docker.pullImage("3.9.9");
    console.log(res);
})()
    .then()
    .catch((error) => {
        console.log(error);
    });
