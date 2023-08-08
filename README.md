# Neons Dao Refund

## Intro
Neons dao community approached me to attempt to return the funds they had locked up in the neons dao treasury. 
They had exchanged canto tokens for a vote and are mostly all voting to refund their canto.

---
## Finding Data
I queried an archive node with the help of Brian from Ansybl and parsed through transaction data to find everyone who won an auction and how much canto they sent to the trasury. I sorted through all the winning bids and created two arrays, the amount of canto each wallet had sent the treasury since the inception of the Neons auctions and the wallet address. From there i took the amount of canto each wallet had and divided by the total amount of canto sent to the treasury to find the percentage each wallet had of the total treasury. I then multiplied the actual amount in the treasury by the percentage for each wallet to find the amount refunded.

----

## Building the contracts

There are two contracts. 
 
 [**MASTER CONTRACT**](https://github.com/chalabi2/noundreund/)

```solidity
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
```

This contract is in charge of receiving Canto tokens from the Neons treasury and allocating it to the Refund children contracts

---

[**CHILD CONTRACTS**](https://github.com/chalabi2/noundreund/)

```solidity
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

```

These contracts split the wallet and amount arrays for distribution and request the total amount of tokens required to refund the wallets in the wallet array for that specific child. This is done because storing a 723 entry array on chain in one transaction is not possible. Accoridng to the tests there will be 14 children contracts

|   Contract   |   Canto   |
|-------|-------|
| 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0 | 333756.89 |
| 0x5FC8d32690cc91D4c39d9d3abcBD16989F875707 | 104210.68 |
| 0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6 | 66905.24 |
| 0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e | 47751.95 |
| 0x9A676e781A523b5d0C0e43731313A708CB607508 | 36441.29 |
| 0x9A9f2CCfdE556A7E9Ff0848998Aa4a0CFD8863AE | 28709.61 |
| 0xc6e7DF5E7b4f2A278906862b61205850344D4e7d | 23633.85 |
| 0x322813Fd9A801c5507c9de605d63CEA4f2CE6c44 | 20089.51 |
| 0x7a2088a1bFc9d81c55368AE168C2C02570cB814F | 16725.46 |
| 0x67d269191c92Caf3cD7723F116c85e6E9bf55933 | 13642.25 |
| 0x84eA74d481Ee0A5332c457a4d796187F6Ba67fEB | 11337.65 |
| 0x1613beB3B2C4f22Ee086B2b38C1476A3cE7f78E8 | 9305.27 |
| 0x95401dc811bb5740090279Ba06cfA8fcF6113778 | 7670.92 |
| 0x4826533B4897376654Bb4d4AD88B7faFD0C98528 | 6351.46 |
| 0x8f86403A4DE0BB5791fa46B8e795C547942fE4Cf | 4869.89 |
TOTAL: | 731,401.92
---
## Testing

**Prerequisites**
- NPX
- Hardhat

Contracts were tested on a simnet and will be tested on Canto testnet once I receive ~730k testnet Canto. Execution is succesful on the simnet. There is a function to send the tokens back to the treasury from the master and back to the master from the children. 

`npx hardhat node` to start the simnet

replace all instances of `localhost` with `canto` if you want to deploy to the canto testnet.

```bash

npx hardhat run --network localhost ./scripts/contracts/deployMaster.ts #Deploy the master contract
npx hardhat run --network localhost ./scripts/tx/sendEth.ts #Fund the contract with 750k canto
npx hardhat run --network localhost ./scripts/contracts/deployChildren.ts #Deploy the children contracts
npx hardhat run --network localhost ./scripts/tests/batchQuery.ts #Check to see how much each contract has recevied
npx hardhat run --network localhost ./scripts/contracts/callRefund.ts #Disburse the tokens from the children
npx hardhat run --network localhost ./scripts/tests/queryWallet.ts #Query the wallets to make sure they have received the tokens
```

`npx hardhat run --network localhost .\scripts\tx\returnTreasuryFunds.ts` to send the tokens back to the treasury from the master

`npx hardhat run --network localhost .\scripts\tx\returnMasterFunds.ts` to send the tokens back to the master from the children

----

## Caveats
This contract does not consider if a wallet that has won an auction has sold or traded their Neon NFT token. We will not be able to dynamically change the data so we must agree to a "snapshot" date and then re collect the data before deploying the contract.

Currently the children will only deploy if the Master contract is funded.

The deployer of the contracts is the only wallet able to make the calls to disburse funds.