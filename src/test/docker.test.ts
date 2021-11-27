import DockerUtils, { version, VERSIONS } from "../docker";

(async function main() {
    // Initialize Docker utils
    console.log("Initializing DockerUtils client");
    const dockerUtils = new DockerUtils({ socketPath: "/var/run/docker.sock" });

    // Pull the version
    const version: version = "3.9.9";
    console.log(`Pulling Python version ${version} with image ${VERSIONS[version]}`);
    await dockerUtils.pullImage(version);

    // Run some test code
    const packages: string[] = ["requests==2.22.0"];
    const code = "import requests;print(requests.get('https://www.google.com/'))";
    console.log(`Installing packages`);
    packages.forEach((pkg) => console.log(pkg));
    console.log(`Executing code:\n${code}`);
    const res = await dockerUtils.runCode(version, code, packages);

    // Log the result
    console.log(`Result of executed code:\n${res}`);
})()
    .then()
    .catch((error) => {
        console.log(error);
    });
