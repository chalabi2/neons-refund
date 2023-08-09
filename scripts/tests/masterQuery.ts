import { ethers } from "hardhat";

export async function BatchQuery() {


        const MasterBalance = await ethers.provider.getBalance("0x46d25eDbD36F7d33a40B7f785a3980a1EDf420A6")
        console.log(`Balance Remaining in Master ${MasterBalance}`)

    }

BatchQuery()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
