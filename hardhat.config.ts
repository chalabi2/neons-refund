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

const RPCURL = "https://canto.evm.chandrastation.com";
const PRIVKEY = [process.env.PRIV_KEY || ''];
const RPCURLLOCAL = ""

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
      chainId: 7700,
    },
    cantoLocal: {
      url: RPCURL,
      accounts: PRIVKEY,
      chainId: 7701,
    },
    hardhat: {
      forking: {
        url: "https://mainnode.plexnode.org:8545",
        blockNumber: 5449412,
      }
    }
  },
};

export default config;
