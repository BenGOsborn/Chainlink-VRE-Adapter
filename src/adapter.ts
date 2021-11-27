import DockerUtils, { Version, versions, JsonResponse } from "./docker";
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
    const version: Version = validator.validated.data.version;
    const code: string = validator.validated.data.code;
    const packages: string[] | undefined = validator.validated.data.packages;

    // Execute callback
    new Promise<JsonResponse>(async (resolve, reject) => {
        // Initialize DockerUtils client
        const dockerUtils = new DockerUtils(120, { socketPath: "/var/run/docker.sock" }); // This socket needs to be exposed to the container this is run in to interact with Docker

        if (!version) reject("Missing version");
        if (versions.filter((vsion) => vsion === version).length === 0) reject(`Invalid version. Valid versions are ${versions}`);
        if (!code) reject("Missing code to execute");

        // Check that the version has been pulled
        await dockerUtils.pullImage(version);

        // Execute the code
        const response = await dockerUtils.runCode(version, code, packages);
        resolve(response);
    })
        .then((response) => callback(200, Requester.success(jobRunID, { data: { result: response.data }, result: response.data, statusCode: 200 })))
        .catch((error) => callback(500, Requester.errored(jobRunID, error)));
}
