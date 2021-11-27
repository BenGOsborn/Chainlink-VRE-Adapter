import DockerUtils, { version, VERSIONS } from "../docker";

(async function main() {
    // Initialize Docker utils
    console.log("Initializing DockerUtils client");
    const dockerUtils = new DockerUtils(120, { socketPath: "/var/run/docker.sock" });

    // Pull the version
    const version: version = "3.9.9";
    console.log(`\nPulling Python version ${version} with image ${VERSIONS[version]}`);
    await dockerUtils.pullImage(version);

    // Run some test code
    const packages: string[] = ["requests==2.22.0"];
    const code = "import requests;print(requests.get('https://www.google.com/'))";

    console.log(`\nInstalling packages\n===================`);
    packages.forEach((pkg) => console.log(pkg));
    console.log(`\nExecuting code:\n===================\n${code}`);

    // Log the result
    const res = await dockerUtils.runCode(version, code, packages);
    console.log(`\nResult of executed code:\n===================\n${res}`);
})()
    .then()
    .catch((error) => {
        console.log(error);
    });
