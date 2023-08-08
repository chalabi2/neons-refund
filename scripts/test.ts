import { waffle, ethers } from "hardhat";
import { DeployMaster } from "../scripts/contracts/deployMaster";
import { SendEth } from "./tx/sendEth";
import { DeployChildren } from "./contracts/deployChildren";
import { BatchQuery } from "./tests/batchQuery";
import { CallRefund } from "./contracts/callRefund";
import { QueryWallet } from "./tests/queryWallets";
import { expect } from "chai";

describe("Full Integration Test", function() {
    it("Should execute all scripts in sequence", async function() {
        // This assumes each function is asynchronous and that they return 
        // any necessary data for assertions or for the next function.

        await DeployMaster();
        await SendEth();
        await DeployChildren();
        await BatchQuery();
        await CallRefund();
        
        // Capture the returned data from QueryWallet
        const queryWalletResults = await QueryWallet();

        // Now make assertions based on the returned results:
        expect(queryWalletResults.totalETH).to.equal(queryWalletResults.expectedETH);
        expect(queryWalletResults.walletsMismatched).to.equal(0);
    });
});
