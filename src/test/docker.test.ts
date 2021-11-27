import DockerUtils, { version } from "../docker";

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
