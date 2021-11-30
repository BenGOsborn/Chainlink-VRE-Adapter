// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";

contract Test is ChainlinkClient {
    using Chainlink for Chainlink.Request;

    uint256 constant private ORACLE_PAYMENT = 1 * LINK_DIVISIBILITY;
    uint256 public currentPrice;
    uint256 public currentResult;

    constructor(address linkAddress_) {
        setChainlinkToken(linkAddress_);
    }

    function requestResult(address _oracle, string memory _jobId, string memory _version, string memory _code, string memory _packages) public {
        Chainlink.Request memory req = buildChainlinkRequest(stringToBytes32(_jobId), address(this), this.fulfillResult.selector); 
        req.add("version", _version);
        req.add("code", _code);
        req.add("packages", _packages);
        sendChainlinkRequestTo(_oracle, req, ORACLE_PAYMENT);
    }

    function fulfillResult(bytes32 _requestId, uint256 _result) public recordChainlinkFulfillment(_requestId) {
        currentResult = _result;
    }

    function withdrawLink() public {
        LinkTokenInterface link = LinkTokenInterface(chainlinkTokenAddress());
        require(link.transfer(msg.sender, link.balanceOf(address(this))), "Unable to transfer");
    }

    function stringToBytes32(string memory source) private pure returns (bytes32 result) {
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }

        assembly { // solhint-disable-line no-inline-assembly
            result := mload(add(source, 32))
        }
    }
}