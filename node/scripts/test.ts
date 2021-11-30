import hre from "hardhat";
import TestABI from "../artifacts/contracts/Test.sol/Test.json";
import addresses from "../address.json";

async function main() {
    // Initialize the contract
    const signer = hre.ethers.provider.getSigner();
    const test = new hre.ethers.Contract(addresses.testAddress, TestABI.abi, signer);
    console.log(`Initialized Test contract from ${addresses.testAddress}`);

    // Request the code to be called
    const oracleAddress = addresses.oracleAddress;
    const jobId = "577c5537-2348-4df4-b16e-047fb44348af".replace(/-/g, "");

    const version = "3.9.9";
    const code = "import requests;import json;print(json.dumps({ 'data': 3 }))";
    const packages = "requests";

    await test.requestResult(oracleAddress, jobId, version, code, packages);
    console.log("Made request for data");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
