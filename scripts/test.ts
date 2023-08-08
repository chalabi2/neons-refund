import { waffle, ethers } from "hardhat";
import { QueryWallet } from "./tests/queryWallets";
import { expect } from "chai";
import { DeployMaster } from "./contracts/deployMaster";
import { CallRefund } from "./contracts/callRefund";
import { DeployChildren } from "./contracts/deployChildren";
import { BatchQuery } from "./tests/batchQuery";
import { SendEth } from "./tx/sendEth";

describe("Full Integration Test", function() {
    it("Should execute all scripts in sequence", async function() {
        try {

            await DeployMaster();
            await SendEth();
            await DeployChildren();
            await BatchQuery();
            await CallRefund();
            
            // Capture the returned data from QueryWallet
            const queryWalletResults = await QueryWallet();

            expect(queryWalletResults.totalETH).to.equal(queryWalletResults.expectedETH);
            expect(queryWalletResults.walletsMismatched).to.equal(0);

            // Log the results
            console.log("Results:");
            console.log("Total ETH:", queryWalletResults.totalETH);
            console.log("Expected ETH:", queryWalletResults.expectedETH);
            console.log("Mismatched Wallets:", queryWalletResults.walletsMismatched);

            console.log("Test Passed Successfully!");

        } catch (error) {
            console.error("Error occurred:", error);
            throw error;
        }
    });
});