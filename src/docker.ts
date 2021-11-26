import Docker from "dockerode";

// Declare the versions of Python
type version = "3.8.12" | "3.9.9" | "3.10.0";
type versions = {
    [key in version]: string;
};
const VERSIONS: versions = { "3.8.12": "python:3.8.12-alpine3.14", "3.9.9": "python:3.9.9-alpine3.14", "3.10.0": "python:3.10.0-alpine3.14" };

// Utils for Docker
class DockerUtils {
    docker: Docker;

    // Initialize the client
    constructor() {
        this.docker = new Docker({ socketPath: "/var/run/docker.sock" }); // This needs to be exposed to the container it is run it
    }

    // Check if the base image exists for the given Python version
    async pullImage(version: version) {
        // Get the list of images
        const images = await this.docker.listImages();
        const imageExists = (tag: string) => {
            const filtered = images.filter((image) => image.RepoTags[0] === tag);
            return filtered.length > 0;
        };

        // Pull the version if it does not exist
        if (version === "3.8.12" && imageExists(VERSIONS[version])) {
            await this.docker.pull("python:3.8.12-alpine3.14");
        } else if (version === "3.9.9" && imageExists(VERSIONS[version])) {
            return this.docker.pull("python:3.9.9-alpine3.14");
        } else if (version === "3.10.0" && imageExists(VERSIONS[version])) {
            return this.docker.pull("python:3.10.0-alpine3.14");
        } else {
            throw Error("This version of Python is not currently supported");
        }
    }
}

(async function main() {
    const docker = new DockerUtils();
    const res = await docker.pullImage("3.8.12");
    // console.log(res);
})()
    .then()
    .catch((error) => {
        console.log(error);
    });
