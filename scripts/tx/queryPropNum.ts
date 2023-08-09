import { ethers } from "hardhat";
import * as ABI  from "../../contracts/NounsDAOLogicV1ABI.json";

async function getProposalIdFromTransaction(txHash: string) {
    const provider = ethers.getDefaultProvider();
    const receipt = await provider.getTransactionReceipt(txHash);

    // Use the ABI to create an Interface
    const contractABI = ABI.abi;
    const contractInterface = new ethers.utils.Interface(contractABI);

    // Loop through logs to find the relevant event
    for (let log of receipt.logs) {
        try {
            const parsedLog = contractInterface.parseLog(log);
            if (parsedLog.name === "ProposalCreated") {  // replace with the actual event name if different
                return parsedLog.args[0];  // The proposal ID will be the first argument in this event
            }
        } catch (e) {
            // Log wasn't from the contract of interest, continue checking
        }
    }
}

const txHash = "0xe349db47fa6a6f4355238b7d2feff719e502ea3f2128a87e534524513c564570";
getProposalIdFromTransaction(txHash).then(id => {
    console.log("Proposal ID:", id);
});
