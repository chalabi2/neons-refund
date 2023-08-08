import { ethers } from "hardhat";

export async function BatchQuery() {


        const MasterBalance = await ethers.provider.getBalance("0x5FbDB2315678afecb367f032d93F642f64180aa3")
        console.log(`Balance Remaining in Master ${MasterBalance}`)

    }

BatchQuery()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
