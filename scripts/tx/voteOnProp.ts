import { ethers } from "hardhat";
import { Contract } from 'ethers';
import * as ABI from "../../contracts/NounsDAOLogicV1ABI.json";

async function main() {
    const impersonateAddress = "0x4458078A41B02E4C4293Dfa1d69faf1978B86e24";
    const contractAddress = '0x4A97Ab43916f844A7C5Aa39BaAc6ece3103C7231';

    const impersonatedSigner = await ethers.getImpersonatedSigner(impersonateAddress);

    const contractABI = ABI.abi;
    const contract: Contract = new ethers.Contract(contractAddress, contractABI).connect(impersonatedSigner);

    // Voting parameters
    const proposalId = 9;
    const support = 1; // 1 means supporting the proposal

    try {
        const txResponse = await contract.castVote(proposalId, support);
        console.log("Transaction hash:", txResponse.hash);

        await txResponse.wait();

        console.log('Vote casted successfully!');
    } catch (error) {
        console.error('Error casting vote:', error);
    }
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
