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
    // The Validator helps you validate the Chainlink request data
    const validator = new Validator(callback, input, customParams);
    const jobRunID = validator.validated.id;
    const endpoint = validator.validated.data.endpoint || "price";
    const url = `https://min-api.cryptocompare.com/data/${endpoint}`;
    const fsym = validator.validated.data.base.toUpperCase();
    const tsyms = validator.validated.data.quote.toUpperCase();

    const params = {
        fsym, // **** From symbol and to symbol
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
}
