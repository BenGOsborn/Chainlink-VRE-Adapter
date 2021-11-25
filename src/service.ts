const { Requester, Validator } = require("@chainlink/external-adapter");

// Define custom error scenarios for the API.
// Return true for the adapter to retry.
function customError(data: any) {
    return data.Response === "Error";
}

// Define custom parameters to be used by the adapter.
// Extra parameters can be stated in the extra object,
// with a Boolean value indicating whether or not they
// should be required.
const customParams = {
    base: ["base", "from", "coin"],
    quote: ["quote", "to", "market"],
    endpoint: false,
};

function createRequest(input: any, callback: any) {
    // The Validator helps you validate the Chainlink request data
    const validator = new Validator(callback, input, customParams);
    const jobRunID = validator.validated.id;
    const endpoint = validator.validated.data.endpoint || "price";
    const url = `https://min-api.cryptocompare.com/data/${endpoint}`;
    const fsym = validator.validated.data.base.toUpperCase();
    const tsyms = validator.validated.data.quote.toUpperCase();

    const params = {
        fsym,
        tsyms,
    };

    // This is where you would add method and headers
    // you can add method like GET or POST and add it to the config
    // The default is GET requests
    // method = 'get'
    // headers = 'headers.....'
    const config = {
        url,
        params,
    };

    // The Requester allows API calls be retry in case of timeout
    // or connection failure
    Requester.request(config, customError)
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
}

// **** Try and figure out how these adapters can work with cloud functions and things like Heroku from that DappUniversity guy and his Chainlink Heroku setup video
// **** Figure out how this entire thing actually works internally

// This is a wrapper to allow the function to work with
// GCP Functions
export const gcpservice = (req: any, res: any) => {
    createRequest(req.body, (statusCode: any, data: any) => {
        res.status(statusCode).send(data);
    });
};

// This is a wrapper to allow the function to work with
// AWS Lambda
export const handler = (event: any, context: any, callback: any) => {
    createRequest(event, (statusCode: any, data: any) => {
        callback(null, data);
    });
};

// This is a wrapper to allow the function to work with
// newer AWS Lambda implementations
export const handlerv2 = (event: any, context: any, callback: any) => {
    createRequest(JSON.parse(event.body), (statusCode: any, data: any) => {
        callback(null, {
            statusCode: statusCode,
            body: JSON.stringify(data),
            isBase64Encoded: false,
        });
    });
};

// This allows the function to be exported for testing
// or for running in express
export default createRequest;
