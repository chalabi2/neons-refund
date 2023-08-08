import { ethers } from "hardhat";

export async function DeployMaster() {

    const [deployer] = await ethers.getSigners();

    console.log("Deploying RefundMaster with the account:", deployer.address);

    const TREASURY_ADDRESS = "0x98d1f7347FF1d0984b6daB1E1Ae3C693d2b0B380";
    const RefundMaster = await ethers.getContractFactory("RefundMaster");
    const masterContract = await RefundMaster.deploy(TREASURY_ADDRESS); 

    console.log("RefundMaster contract deployed to:", masterContract.address);
}

DeployMaster()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
