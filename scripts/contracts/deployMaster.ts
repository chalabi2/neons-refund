import { ethers } from "hardhat";

 export async function DeployMaster() {

    const [deployer] = await ethers.getSigners();

    console.log("Deploying RefundMaster with the account:", deployer.address);

    const TREASURY_ADDRESS = "0xD10f179c2D1Cba52e862A02563f416fDA0401396" //currently set to the public key i used;
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
