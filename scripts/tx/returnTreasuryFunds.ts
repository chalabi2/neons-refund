import { ethers } from "hardhat";

async function main() {
    const masterAddress = "0x550b1F7345C8be53603797A13C413038352Ba5E9";
    const signer = (await ethers.getSigners())[0];

    const RefundMaster = await ethers.getContractFactory("RefundMaster");
    const masterContract = RefundMaster.attach(masterAddress).connect(signer);

    const tx = await masterContract.returnToTreasury();
    console.log(`Transaction hash: ${tx.hash}`);

    await tx.wait();

    console.log("Funds returned to the treasury successfully.");

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
