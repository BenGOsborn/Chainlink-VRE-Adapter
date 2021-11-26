import Docker from "dockerode";

// First check if the image exists

class DockerUtils {
    docker: Docker;

    // Initialize the client
    constructor() {
        this.docker = new Docker({ socketPath: "/var/run/docker.sock" });
    }

    // Check if the base image exists for the given Python version
    getImage(version: "3.8.12" | "3.9.9" | "3.10.0") {
        if (version === "3.8.12") {
            this.docker.getImage("python:3.8.12-alpine3.14");
        } else if (version === "3.9.9") {
            this.docker.getImage("python:3.9.9-alpine3.14");
        } else if (version === "3.10.0") {
            this.docker.getImage("python:3.10.0-alpine3.14");
        } else {
        }
    }
}
