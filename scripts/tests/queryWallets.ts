import { ethers } from "hardhat";
import { ethWallets } from "../utils/wallets";
import { ethAmounts } from "../utils/amounts";
import { getAddresses } from "../utils/addressStorage";

export async function QueryWallet() {
    const addresses = ethWallets;
    const amounts = ethAmounts;
  
    if (addresses.length !== amounts.length) {
      throw new Error("Mismatched number of addresses and amounts");
    }
  
    const childAddresses = getAddresses();
    const ContractFactory = await ethers.getContractFactory("RefundBatch");
    
    let totalEthSentViaEvents = ethers.BigNumber.from(0);
    let mismatchedWalletsCount = 0;

    for (let i = 0; i < addresses.length; i++) {
        const address = addresses[i];
        const expectedAmount = ethers.BigNumber.from(amounts[i]);

        let totalReceivedForAddress = ethers.BigNumber.from(0);

        for (let childAddress of childAddresses) {
            const contract = ContractFactory.attach(childAddress);
            const events = await contract.queryFilter(contract.filters.TokensSent(address));
            const receivedAmount = events.reduce((acc, event) => acc.add(event.args[1]), ethers.BigNumber.from(0));
            totalReceivedForAddress = totalReceivedForAddress.add(receivedAmount);
        }

        totalEthSentViaEvents = totalEthSentViaEvents.add(totalReceivedForAddress);
        if (!totalReceivedForAddress.eq(expectedAmount)) {
            mismatchedWalletsCount++;
        }
    }
    
    const totalEthFormatted = ethers.utils.formatEther(totalEthSentViaEvents);
  
    console.log(`Total ETH received via events across all wallets: ${totalEthFormatted} ETH`);
    console.log(`Expected total ETH: 731,401.92 ETH`);
    console.log(`Number of wallets with incorrect amounts received: ${mismatchedWalletsCount}`);
  
    return {
      totalETH: totalEthFormatted,
      expectedETH: 731401.92,
      walletsMismatched: mismatchedWalletsCount 
    };
}

QueryWallet()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
