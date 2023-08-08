import { ethers } from "hardhat";
import { getAddresses } from "../utils/addressStorage";  
async function main() {
    const RefundBatch = await ethers.getContractFactory("RefundBatch");

    // Get the signer (default account from Hardhat)
    const [signer] = await ethers.getSigners();
    console.log('Using account:', await signer.getAddress());

    // Fetch all child contract addresses
    const childAddresses = getAddresses();  
    for (const childAddress of childAddresses) {
        const contract = RefundBatch.attach(childAddress);

        // Ensure the signer is either the owner or the master
        const owner = await contract.owner();
        const master = await contract.master();

        if (signer.address !== owner && signer.address !== master) {
            console.log(`The current signer is neither the owner nor the master for contract at ${childAddress}. Skipping...`);
            continue;  // Skip to the next child contract if the signer isn't authorized
        }

        // Call the returnToMaster function
        try {
            const tx = await contract.connect(signer).returnToMaster();
            await tx.wait();
            console.log(`Funds returned to master from child contract at ${childAddress} successfully!`);
        } catch (err) {
            console.error(`Failed to return funds from child contract at ${childAddress}. Error: ${err.message}`);
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
