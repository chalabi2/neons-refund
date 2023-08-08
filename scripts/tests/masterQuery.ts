import { ethers } from "hardhat";

export async function BatchQuery() {


        const MasterBalance = await ethers.provider.getBalance("0x550b1F7345C8be53603797A13C413038352Ba5E9")
        console.log(`Balance Remaining in Master ${MasterBalance}`)

    }

BatchQuery()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
