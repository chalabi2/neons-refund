import { ethers } from "hardhat";

export async function BatchQuery() {


        const MasterBalance = await ethers.provider.getBalance("0x3Aa5ebB10DC797CAC828524e59A333d0A371443c")
        console.log(`Balance Remaining in Master ${MasterBalance}`)

    }

BatchQuery()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
