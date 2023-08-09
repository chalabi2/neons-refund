# Neons Dao Refund

## Intro
Neons dao community approached me to attempt to return the funds they had locked up in the neons dao treasury. 
They had exchanged canto tokens for a vote and are mostly all voting to refund their canto.


## Finding Data
With Brian from Ansybl's assistance, I accessed an archive node to examine transaction data. This helped identify auction winners and calculate the amount of Canto they contributed to the treasury. I then compiled all winning bids into two lists: one for the sum of Canto each wallet transferred since the beginning of the Neons auctions, and another for the corresponding wallet addresses. By comparing each wallet's contribution against the total treasury deposits, I determined their individual contribution percentages. Finally, I calculated the refund amount for each wallet by multiplying the treasury's actual balance by each wallet's contribution percentage.



## Building the contracts

There are two contracts. 
 
 [**MASTER CONTRACT**](https://github.com/chalabi2/noundreund/) 0x3Aa5ebB10DC797CAC828524e59A333d0A371443c

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

```
Child 0 deployed at:  0xc6e7DF5E7b4f2A278906862b61205850344D4e7d
Child 1 deployed at:  0x322813Fd9A801c5507c9de605d63CEA4f2CE6c44
Child 2 deployed at:  0x7a2088a1bFc9d81c55368AE168C2C02570cB814F
Child 3 deployed at:  0x67d269191c92Caf3cD7723F116c85e6E9bf55933
Child 4 deployed at:  0x84eA74d481Ee0A5332c457a4d796187F6Ba67fEB
Child 5 deployed at:  0x1613beB3B2C4f22Ee086B2b38C1476A3cE7f78E8
Child 6 deployed at:  0x95401dc811bb5740090279Ba06cfA8fcF6113778
Child 7 deployed at:  0x4826533B4897376654Bb4d4AD88B7faFD0C98528
Child 8 deployed at:  0x8f86403A4DE0BB5791fa46B8e795C547942fE4Cf
Child 9 deployed at:  0x36C02dA8a0983159322a80FFE9F24b1acfF8B570
Child 10 deployed at:  0x1291Be112d480055DaFd8a610b7d1e203891C274
Child 11 deployed at:  0xCD8a1C3ba11CF5ECfa6267617243239504a98d90
Child 12 deployed at:  0x7969c5eD335650692Bc04293B07F5BF2e7A673C0
Child 13 deployed at:  0xFD471836031dc5108809D173A067e8486B9047A3
Child 14 deployed at:  0xB0D4afd8879eD9F52b28595d31B441D079B2Ca07
```

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

| Contract                                      | Canto         |
|-----------------------------------------------|---------------|
| 0xc6e7DF5E7b4f2A278906862b61205850344D4e7d   | 309011.0 Canto|
| 0x322813Fd9A801c5507c9de605d63CEA4f2CE6c44   | 101423.0 Canto|
| 0x7a2088a1bFc9d81c55368AE168C2C02570cB814F   | 64093.0 Canto |
| 0x67d269191c92Caf3cD7723F116c85e6E9bf55933   | 46915.042 Canto|
| 0x84eA74d481Ee0A5332c457a4d796187F6Ba67fEB   | 35802.0 Canto |
| 0x1613beB3B2C4f22Ee086B2b38C1476A3cE7f78E8   | 28205.0 Canto |
| 0x95401dc811bb5740090279Ba06cfA8fcF6113778   | 23219.0 Canto |
| 0x4826533B4897376654Bb4d4AD88B7faFD0C98528   | 19739.0 Canto |
| 0x8f86403A4DE0BB5791fa46B8e795C547942fE4Cf   | 16433.0 Canto |
| 0x36C02dA8a0983159322a80FFE9F24b1acfF8B570   | 13401.0 Canto |
| 0x1291Be112d480055DaFd8a610b7d1e203891C274   | 11132.0 Canto |
| 0xCD8a1C3ba11CF5ECfa6267617243239504a98d90   | 9143.0 Canto  |
| 0x7969c5eD335650692Bc04293B07F5BF2e7A673C0   | 7541.0 Canto  |
| 0xFD471836031dc5108809D173A067e8486B9047A3   | 6239.0 Canto  |
| 0xB0D4afd8879eD9F52b28595d31B441D079B2Ca07   | 4774.0 Canto  |
TOTAL: | 697,070

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


## Caveats
This contract does not consider if a wallet that has won an auction has sold or traded their Neon NFT token. We will not be able to dynamically change the data so we must agree to a "snapshot" date and then re collect the data before deploying the contract.

Currently the children will only deploy if the Master contract is funded.

The deployer of the contracts is the only wallet able to make the calls to disburse funds.

Ive rounded to simplify the math and I have also spared 105 tokens in the Executor contract. 

# To-Do
- Deploy on Canto Main Net
 - Gas Cost
