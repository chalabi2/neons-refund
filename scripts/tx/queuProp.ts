import { ethers } from "hardhat";
import * as ABI  from "../../contracts/NounsDAOLogicV1ABI.json";

async function main() {
    // Contract ABI & Address
    const impersonateAddress = "0xD1A8a03BF9aF122aBD40d1156a758DBdf3A31cf2";
    const impersonatedSigner = await ethers.getImpersonatedSigner(impersonateAddress);
    const contractABI = ABI.abi; // Replace with your contract ABI
    const contractAddress = '0x4A97Ab43916f844A7C5Aa39BaAc6ece3103C7231'; // Replace with your contract address

    // Setup provider and signer
    const [signer] = await ethers.getSigners();

    // Connect to contract
    const contract = new ethers.Contract(contractAddress, contractABI, impersonatedSigner);

    // Proposal ID (replace with your actual ID)
    const proposalId = 7;

    try {
        // Invoke the queue function
        const txResponse = await contract.queue(proposalId);
        console.log("Transaction hash:", txResponse.hash);

        // Wait for transaction to be mined
        await txResponse.wait();
        console.log('Queued successfully!');
    } catch (error) {
        console.error('Error queuing the proposal:', error);
    }
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
