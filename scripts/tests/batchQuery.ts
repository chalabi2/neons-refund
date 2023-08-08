import { ethers } from "hardhat";
import { getAddresses } from "../utils/addressStorage";

export async function BatchQuery() {
    const addresses = getAddresses();

    const RefundBatch = await ethers.getContractFactory("RefundBatch");

    for (let address of addresses) {
        const contract = RefundBatch.attach(address);
        const owner = await contract.owner();
        const balance = await ethers.provider.getBalance(address);
        const MasterBalance = await ethers.provider.getBalance("0x550b1F7345C8be53603797A13C413038352Ba5E9")
        console.log(`Balance of contract at ${address}: ${ethers.utils.formatEther(balance)} ETH`);
        console.log(`Owner of contract at ${address}: ${owner}`);
        console.log(`Balance Remaining in Master ${MasterBalance}`)

    }
}

BatchQuery()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
