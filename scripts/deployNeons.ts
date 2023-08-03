import { ethers } from "hardhat";
import { wallets } from "./wallets";
import { ethAmounts } from "./amounts";

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    const TokenDisbursement = await ethers.getContractFactory("Disbursement");
    const recipients = wallets;
    const amounts = ethAmounts;
    const tokenDisbursement = await TokenDisbursement.deploy(recipients, amounts) as ethers.Contract;

    console.log("Disbursement contract deployed to:", tokenDisbursement.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
