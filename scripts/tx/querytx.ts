import { ethers } from "hardhat";

async function main() {
    // Define the transaction hash you want to query
    const txHash = "0x9e9130a0cf7d7749e7fa9e165e97d3d893e685f7120da33387f269845b4e9b3a";

    // Get the provider from Hardhat
    const provider = ethers.provider;

    try {
        // Query the transaction by its hash
        const tx = await provider.getTransaction(txHash);

        // Log the transaction details
        console.log(tx);

    } catch (error) {
        console.error('Error querying the transaction:', error);
    }
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
