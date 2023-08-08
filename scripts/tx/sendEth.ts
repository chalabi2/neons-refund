import { ethers } from "hardhat";

export async function SendEth() {
    const [sender] = await ethers.getSigners(); 

    const amountToSend = ethers.utils.parseEther('750000'); // Sending 10 Ether as an example
    const recipientAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
    const tx = await sender.sendTransaction({
        to: recipientAddress,
        value: amountToSend
    });
    await tx.wait();
    const MasterBalance = await ethers.provider.getBalance("0x5FbDB2315678afecb367f032d93F642f64180aa3")
    console.log(`Sent ${MasterBalance} Ether to ${recipientAddress}`);
}

SendEth()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });