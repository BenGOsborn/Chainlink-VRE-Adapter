import hre from "hardhat";
import TestABI from "../artifacts/contracts/Test.sol/Test.json";
import addresses from "../address.json";

async function main() {
    // Initialize the contract
    const signer = hre.ethers.provider.getSigner();
    const test = new hre.ethers.Contract(addresses.testAddress, TestABI.abi, signer);
    console.log(`Initialized Test contract from ${addresses.testAddress}`);

    // Request the code to be called
    const jobId = "5f365826624242ad87ccda36c0b86c93";
    const oracleAddress = addresses.oracleAddress;
    const linkFee = "1";

    const version = "3.9.9";
    const code = "import json;print(json.dumps({ 'data': 3 }))";
    const packages = "";
    await test.callRequest(jobId, oracleAddress, linkFee, version, code, packages);
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
