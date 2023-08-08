import { ethers } from "hardhat";
import { BigNumber } from "ethers";
import { ethAmounts } from "../utils/amounts";
import { ethWallets } from "../utils/wallets";
import { addAddress } from "../utils/addressStorage"; 

export async function DeployChildren() {

    const masterAddress = "0x550b1F7345C8be53603797A13C413038352Ba5E9";
    const RefundMaster = await ethers.getContractFactory("RefundMaster");
    const masterContract = RefundMaster.attach(masterAddress);

    const wallets = ethWallets;
    const amounts = ethAmounts.map(amount => amount.toString());

    const TOTAL_CHILD_CONTRACTS = 15;
    const BASE_ENTRIES_PER_CHILD = Math.floor(wallets.length / TOTAL_CHILD_CONTRACTS);
    const EXTRA_ENTRIES = wallets.length % TOTAL_CHILD_CONTRACTS;

    let startIndex = 0;
    for (let i = 0; i < TOTAL_CHILD_CONTRACTS; i++) {
        let numEntriesForThisChild = BASE_ENTRIES_PER_CHILD + (i < EXTRA_ENTRIES ? 1 : 0);
        let endIndex = startIndex + numEntriesForThisChild;

        let sliceOfWallets = wallets.slice(startIndex, endIndex);
        let sliceOfAmounts = amounts.slice(startIndex, endIndex);

        let totalForThisChild = sliceOfAmounts.reduce((a, b) => a.add(BigNumber.from(b)), BigNumber.from(0));

        const RefundBatch = await ethers.getContractFactory("RefundBatch");
        let childContract = await RefundBatch.deploy(sliceOfWallets, sliceOfAmounts, masterContract.address, {
            gasLimit: 5000000
        });
        addAddress(childContract.address);
        console.log(`Child ${i} deployed at: `, childContract.address);

        let receipt1 = await masterContract.addChildContract(childContract.address);
        await receipt1.wait();
        let receipt2 = await masterContract.fundChild(childContract.address, totalForThisChild);
        await receipt2.wait();

        startIndex = endIndex;
    }
}

DeployChildren()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
