import { ethers } from "hardhat";

export async function SendEth() {
    const [sender] = await ethers.getSigners(); 

    const amountToSend = ethers.utils.parseEther('750000');
    const recipientAddress = "0x550b1F7345C8be53603797A13C413038352Ba5E9"
    const tx = await sender.sendTransaction({
        to: recipientAddress,
        value: amountToSend
    });
    await tx.wait();
    const MasterBalance = await ethers.provider.getBalance("0x550b1F7345C8be53603797A13C413038352Ba5E9")
    console.log(`Sent ${MasterBalance} $CANTO to ${recipientAddress}`);
}

SendEth()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });