import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import "hardhat-deploy";
import "@nomiclabs/hardhat-ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";

import * as dotenv from 'dotenv';
dotenv.config();


declare module "hardhat/types/runtime" {
  interface HardhatRuntimeEnvironment {
    // ... (all the stuff from above)
  }
}

const RPCURL = "https://canto-testnet.plexnode.wtf";
const PRIVKEY = [process.env.PRIV_KEY || ''];

const config: HardhatUserConfig = {
  solidity: "0.8.4",
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
  networks: {
    canto: {
      url: RPCURL,
      accounts: PRIVKEY,
      chainId: 7701,
    },
    hardhat: {
      accounts: {
        accountsBalance: "1000000000000000000000000", // 1 million ETH in wei
      },
      allowUnlimitedContractSize: true,
      gas: "auto",  // Automatically estimate the gas
      blockGasLimit: 100000000, 
    },
  },
};

export default config;
