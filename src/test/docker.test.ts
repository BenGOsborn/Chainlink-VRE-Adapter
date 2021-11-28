import DockerUtils from "../docker";

(async function main() {
    // Initialize Docker utils
    console.log("Initializing DockerUtils client");
    const dockerUtils = new DockerUtils(120, { socketPath: "/var/run/docker.sock" });

    // Test the version
    const version = "3.9.9";
    const isSupported = dockerUtils.isSupportedVersion(version);
    const supportedVersions = dockerUtils.getSupportedVersions();
    console.log(`Version ${version} ${isSupported ? "is" : "is not"} supported. All supported options: ${supportedVersions}`);

    // Run some test code
    const packages: string[] = ["requests==2.22.0"];
    const code = "import requests;import json;print(json.dumps({ 'data': true })))";

    console.log(`\nInstalling packages\n===================`);
    packages.forEach((pkg) => console.log(pkg));
    console.log(`\nExecuting code:\n===================\n${code}`);

    // Log the result
    const res = await dockerUtils.runCode(version, code, packages);
    console.log(`\nResult of executed code:\n===================\n${res.data}`);
})()
    .then()
    .catch((error) => {
        console.log(error);
    });
