import { ethers } from "hardhat";
import { getAddresses } from "../utils/addressStorage";

export async function BatchQuery() {
    const addresses = getAddresses();

    const RefundBatch = await ethers.getContractFactory("RefundBatch");

    for (let address of addresses) {
        const contract = RefundBatch.attach(address);
        const owner = await contract.owner();
        const balance = await ethers.provider.getBalance(address);
        const MasterBalance = await ethers.provider.getBalance("0x3Aa5ebB10DC797CAC828524e59A333d0A371443c")
        console.log(`${address}: ${ethers.utils.formatEther(balance)} Canto`);

    }
}

BatchQuery()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
