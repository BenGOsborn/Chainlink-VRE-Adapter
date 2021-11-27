import DockerUtils, { version, VERSIONS } from "./docker";
const { Requester, Validator } = require("@chainlink/external-adapter");

// Define custom parameters to be used by the adapter.
// Extra parameters can be stated in the extra object,
// with a Boolean value indicating whether or not they
// should be required.
const customParams = {
    version: ["version", "v"],
    code: ["code", "executable"],
    packages: false,
};

export default function createRequest(input: any, callback: any) {
    // Validate Chainlink request
    const validator = new Validator(callback, input, customParams);
    const jobRunID = validator.validated.id;

    // Get the data from the request
    const version: version = validator.validated.data.version;
    const code: string = validator.validated.data.code;
    const packages: string[] | undefined = validator.validated.data.packages;

    // The Requester allows API calls be retry in case of timeout
    // or connection failure
    Requester.request(config, (data: any) => {})
        .then((response: any) => {
            // It's common practice to store the desired value at the top-level
            // result key. This allows different adapters to be compatible with
            // one another.
            response.data.result = Requester.validateResultNumber(response.data, [tsyms]);
            callback(response.status, Requester.success(jobRunID, response));
        })
        .catch((error: any) => {
            callback(500, Requester.errored(jobRunID, error));
        });

    // Execute callback
    new Promise<void>(async (resolve, reject) => {
        // Initialize DockerUtils client
        const dockerUtils = new DockerUtils(120, { socketPath: "/var/run/docker.sock" }); // This socket needs to be exposed to the container this is run in to interact with Docker

        if (!version) reject("Missing version");
        if (Object.keys(VERSIONS).filter((vsion) => vsion === version).length === 0) reject(`Invalid version. Valid versions are ${Object.keys(VERSIONS)}`);
        if (!code) reject("Missing code to execute");

        // Check that the version has been pulled
        await dockerUtils.pullImage(version);

        // Execute the code
        const response = await dockerUtils.runCode(version, code, packages);
        resolve();
    })
        .then()
        .catch();
}
