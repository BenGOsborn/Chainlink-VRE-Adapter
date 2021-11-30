pragma solidity 0.8.0;
import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Test is ChainlinkClient {
    using Chainlink for Chainlink.Request;

    address private linkAddress;
    uint256 public result;

    constructor(address linkAddress_) {
        linkAddress = linkAddress_;
        setChainlinkToken(linkAddress_);
    }

    // function callRequest(bytes32 _jobId, address _oracle, uint256 _linkFee, string memory _version, string memory _code, string memory _packages) public returns (bytes32) {
    function callRequest(address _oracle, uint256 _linkFee, string memory _version, string memory _code, string memory _packages) public returns (bytes32) {
        bytes32 _jobId = "fb0c6b74f97148069faf5aec269dc1bf";
        Chainlink.Request memory request = buildChainlinkRequest(_jobId, address(this), this.fulfill.selector);
        request.add("version", _version);
        request.add("code", _code); // MUST OUTPUT JSON - JSON library is required
        request.add("packages", _packages);
        return sendChainlinkRequestTo(_oracle, request, _linkFee);
    }

    function fulfill(bytes32 _requestId, uint256 _response) public recordChainlinkFulfillment(_requestId) {
        result = _response;
    }

    function withdrawLink() public {
        IERC20(linkAddress).transfer(msg.sender, IERC20(linkAddress).balanceOf(address(this)));
    }
}