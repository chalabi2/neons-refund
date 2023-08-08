pragma solidity ^0.8.4;

contract RefundBatch {
    address public owner;
    address payable[] public recipients;
    uint256[] public amounts;
    
    address payable public master;

    // Add the TokensSent event
    event TokensSent(address indexed recipient, uint256 amount);

    receive() external payable { }

    modifier onlyOwnerOrMaster() {
        require(msg.sender == owner || msg.sender == master, "Not authorized");
        _;
    }

    constructor(address payable[] memory _recipients, uint256[] memory _amounts, address payable _master) { 
        require(_recipients.length == _amounts.length, "Mismatched arrays");

        owner = msg.sender;
        recipients = _recipients;
        amounts = _amounts;
        master = _master;
    }

    function disburse() external onlyOwnerOrMaster {
        uint256 totalSent = 0;

        for (uint256 i = 0; i < recipients.length; i++) {
            require(recipients[i].send(amounts[i]), "Failed to send CANTO");
            totalSent += amounts[i];

            // Emit the TokensSent event when tokens are successfully sent
            emit TokensSent(recipients[i], amounts[i]);
        }

        uint256 balance = address(this).balance;
        if (balance > 0) {
            require(master.send(balance), "Failed to send back remaining CANTO to Master");
        }
    }
    
    function returnToMaster() external onlyOwnerOrMaster {
        require(master.send(address(this).balance), "Failed to send CANTO to Master");
    }
}
