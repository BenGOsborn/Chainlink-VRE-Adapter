pragma solidity 0.6.6;
import "@chainlink/contracts/src/v0.6/ChainlinkClient.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Test is ChainlinkClient {
    address private linkAddress;
    uint256 public result;

    constructor(address linkAddress_) {
        linkAddress = linkAddress_;
        setChainlinkToken(linkAddress_);
    }

    function callRequest(bytes32 _jobId, address _oracle, uint256 _linkFee) public returns (bytes32) {
        Chainlink.Request memory request = buildChainlinkRequest(_jobId, address(this), this.fulfill.selector);
        request.add("version", "3.9.9");
        request.add("code", "import requests;import json;print(json.dumps({ 'data': 3 }))");
        request.add("packages", "requests");
        return sendChainlinkRequestTo(_oracle, request, _linkFee);
    }

    function fulfill(bytes32 _requestId, uint256 _response) public recordChainlinkFulfillment(_requestId) {
        result = _repsonse;
    }

    function withdrawLink() public {
        IERC20(linkAddress).transfer(msg.sender, IERC20(linkAddress).balanceOf(address(this)););
    }
}