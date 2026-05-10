// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract OrbitWallet {
    address public owner;
    address public authorizedAgent;
    uint256 public perTxCap;
    uint256 public dailyCap;
    uint256 public cooldownSeconds;
    uint256 public pausedState;
    uint256 public spentToday;
    uint256 public spendWindowStart;
    uint256 public lastExecutionAt;

    mapping(address => bool) public allowedRecipients;
    mapping(bytes4 => bool) public allowedSelectors;

    event AgentAuthorized(address indexed wallet, address indexed agent);
    event RecipientUpdated(address indexed recipient, bool allowed);
    event SelectorUpdated(bytes4 indexed selector, bool allowed);
    event PolicyUpdated(address indexed wallet, bytes32 policyHash);
    event OperationExecuted(address indexed wallet, address indexed agent, address indexed to, uint256 value, bytes32 receiptRoot);
    event OperationRejected(address indexed wallet, address indexed agent, bytes32 receiptRoot, string reason);

    modifier onlyOwner() {
        require(msg.sender == owner, "ONLY_OWNER");
        _;
    }

    modifier onlyAgentOrOwner() {
        require(msg.sender == owner || msg.sender == authorizedAgent, "ONLY_AGENT_OR_OWNER");
        _;
    }

    constructor(address initialOwner, address initialAgent, uint256 initialPerTxCap, uint256 initialDailyCap, uint256 initialCooldownSeconds) payable {
        require(initialOwner != address(0), "OWNER_REQUIRED");
        owner = initialOwner;
        authorizedAgent = initialAgent;
        perTxCap = initialPerTxCap;
        dailyCap = initialDailyCap;
        cooldownSeconds = initialCooldownSeconds;
        spendWindowStart = block.timestamp;
        emit AgentAuthorized(address(this), initialAgent);
        emit PolicyUpdated(address(this), policyHash());
    }

    receive() external payable {}

    function setAuthorizedAgent(address agent) external onlyOwner {
        authorizedAgent = agent;
        emit AgentAuthorized(address(this), agent);
    }

    function setPolicy(uint256 newPerTxCap, uint256 newDailyCap, uint256 newCooldownSeconds, uint256 newPausedState) external onlyOwner {
        perTxCap = newPerTxCap;
        dailyCap = newDailyCap;
        cooldownSeconds = newCooldownSeconds;
        pausedState = newPausedState;
        emit PolicyUpdated(address(this), policyHash());
    }

    function setRecipient(address recipient, bool allowed) external onlyOwner {
        allowedRecipients[recipient] = allowed;
        emit RecipientUpdated(recipient, allowed);
    }

    function setSelector(bytes4 selector, bool allowed) external onlyOwner {
        allowedSelectors[selector] = allowed;
        emit SelectorUpdated(selector, allowed);
    }

    function execute(address to, uint256 value, bytes calldata data, bytes32 receiptRoot) external onlyAgentOrOwner returns (bytes memory result) {
        string memory rejection = rejectionReason(to, value, data);
        if (bytes(rejection).length != 0) {
            emit OperationRejected(address(this), msg.sender, receiptRoot, rejection);
            revert(rejection);
        }

        _rollSpendWindowIfNeeded();
        spentToday += value;
        lastExecutionAt = block.timestamp;

        (bool ok, bytes memory response) = to.call{value: value}(data);
        require(ok, "CALL_FAILED");

        emit OperationExecuted(address(this), msg.sender, to, value, receiptRoot);
        return response;
    }

    function rejectionReason(address to, uint256 value, bytes calldata data) public view returns (string memory) {
        if (pausedState != 0) return "WALLET_PAUSED";
        if (!allowedRecipients[to]) return "RECIPIENT_NOT_ALLOWED";
        if (value > perTxCap) return "PER_TX_CAP_EXCEEDED";
        if (_currentSpentToday() + value > dailyCap) return "DAILY_CAP_EXCEEDED";
        if (lastExecutionAt != 0 && block.timestamp < lastExecutionAt + cooldownSeconds) return "COOLDOWN_ACTIVE";
        if (data.length >= 4) {
            bytes4 selector;
            assembly {
                selector := calldataload(data.offset)
            }
            if (!allowedSelectors[selector]) return "SELECTOR_NOT_ALLOWED";
        }
        return "";
    }

    function policyHash() public view returns (bytes32) {
        return keccak256(abi.encode(perTxCap, dailyCap, cooldownSeconds, pausedState, authorizedAgent));
    }

    function _currentSpentToday() internal view returns (uint256) {
        if (block.timestamp >= spendWindowStart + 1 days) {
            return 0;
        }
        return spentToday;
    }

    function _rollSpendWindowIfNeeded() internal {
        if (block.timestamp >= spendWindowStart + 1 days) {
            spendWindowStart = block.timestamp;
            spentToday = 0;
        }
    }
}
