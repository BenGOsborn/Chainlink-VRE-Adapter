import DockerUtils, { JsonResponse } from "./docker";
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
    const validator = new Validator(input, customParams);
    const jobRunID = validator.validated.id;

    // Get the data from the request
    const version: string = validator.validated.data.version;
    const code: string = validator.validated.data.code;

    const packagesRaw: string | undefined = validator.validated.data.packages;
    let packages: string[] | undefined = undefined;
    if (packagesRaw && typeof packagesRaw === "string") packages = packagesRaw.split(",");

    // Execute callback
    new Promise<JsonResponse>(async (resolve, reject) => {
        // Initialize DockerUtils client
        const TIMEOUT = 30;
        const dockerUtils = new DockerUtils(TIMEOUT, { socketPath: "/var/run/docker.sock" }); // This socket needs to be exposed to the container this is run in to interact with Docker

        // Check the params
        if (!version) reject("Missing version");
        if (!dockerUtils.isSupportedVersion(version)) reject(`Invalid version. Valid versions are ${dockerUtils.getSupportedVersions()}`);
        if (!code) reject("Missing code to execute");

        // Execute the code
        try {
            const response = await dockerUtils.runCode(version, code, packages);
            resolve(response);
        } catch (e) {
            reject(e as string);
        }
    })
        .then((response) => {
            console.log(`Response: '${response.data}'`);
            callback(200, Requester.success(jobRunID, { data: { result: response.data }, result: response.data, statusCode: 200 }));
        })
        .catch((error) => {
            console.error(error);
            callback(500, Requester.errored(jobRunID, error));
        });
}
