pragma solidity ^0.8.4;

contract RefundMaster {
    address public owner;
    address payable public treasury; 
    mapping(address => bool) public childContracts;

event ReceivedFunds(address from, uint256 amount);

receive() external payable {
    emit ReceivedFunds(msg.sender, msg.value);
}


    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    constructor(address payable _treasury) { 
        owner = msg.sender;
        treasury = _treasury;
    }

    function addChildContract(address child) external onlyOwner {
        childContracts[child] = true;
    }

function fundChild(address payable child, uint256 amount) external onlyOwner {
    require(childContracts[child], "Not a registered child");
    

    (bool success, ) = child.call{value: amount}("");
    require(success, "Failed to send CANTO to child");
}

    
    function returnToTreasury() external onlyOwner {
        require(treasury.send(address(this).balance), "Failed to send CANTO to Treasury");
    }
}
