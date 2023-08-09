import { ethers } from "hardhat";

export async function SendEth() {
    const [sender] = await ethers.getSigners(); 

    const amountToSend = ethers.utils.parseEther('750000'); // Sending 10 Ether as an example
    const recipientAddress = "0x3Aa5ebB10DC797CAC828524e59A333d0A371443c"
    const tx = await sender.sendTransaction({
        to: recipientAddress,
        value: amountToSend
    });
    await tx.wait();
    const MasterBalance = await ethers.provider.getBalance("0x3Aa5ebB10DC797CAC828524e59A333d0A371443c")
    console.log(`Sent ${MasterBalance} Ether to ${recipientAddress}`);
}

SendEth()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });