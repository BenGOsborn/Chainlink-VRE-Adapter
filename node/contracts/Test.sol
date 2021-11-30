pragma solidity 0.6.6;
import "@chainlink/contracts/src/v0.6/ChainlinkClient.sol";

contract Test is ChainlinkClient {
    constructor(address linkAddress_) {
        setChainlinkToken(linkAddress_);
    }
}