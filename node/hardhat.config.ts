import "@nomiclabs/hardhat-waffle";
import dotenv from "dotenv";
dotenv.config();

// Load in environment variables
const PRIVATE_KEY = process.env.PRIVATE_KEY as string;
const INFURA_URL = process.env.INFURA_URL as string;

export default {
    networks: {
        hardhat: {},
        rinkeby: {
            url: INFURA_URL,
            accounts: [PRIVATE_KEY],
        },
    },
    solidity: {
        compilers: [
            { version: "0.6.6", settings: { optimizer: { enabled: true, runs: 200 } } },
            { version: "0.8.0", settings: { optimizer: { enabled: true, runs: 200 } } },
        ],
    },
};
