import { ethers } from "hardhat";
import { Contract } from 'ethers';
import * as ABI  from "../../contracts/NounsDAOLogicV1ABI.json";

async function main() {
    const impersonateAddress = "0xD1A8a03BF9aF122aBD40d1156a758DBdf3A31cf2";
    const contractAddress = '0x4A97Ab43916f844A7C5Aa39BaAc6ece3103C7231';

    const impersonatedSigner = await ethers.getImpersonatedSigner(impersonateAddress);

    const contractABI = ABI.abi;
    const contract: Contract = new ethers.Contract(contractAddress, contractABI).connect(impersonatedSigner);

    // Your proposal parameters
    const targets = ['0x3Aa5ebB10DC797CAC828524e59A333d0A371443c']; // Address you want to send funds to
    const values = [ethers.utils.parseEther('697175')]; // 697,175 ETH in wei
    const signatures = ['0x']; // Empty string since no specific function is being called
    const calldatas = ['0x']; // Empty calldata
    const description = 'Test Refund'; // Adjust this to your preference

    try {
        const txResponse = await contract.propose(targets, values, signatures, calldatas, description);
        console.log("Transaction hash:", txResponse.hash);

        await txResponse.wait();

        console.log('Proposal submitted successfully!');
        console.log('Proposal #', txResponse)
    } catch (error) {
        console.error('Error submitting proposal:', error);
    }
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
