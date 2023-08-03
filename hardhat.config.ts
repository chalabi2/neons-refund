import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import "hardhat-deploy";

const RPCURL = "https://canto-testnet.plexnode.wtf"
const PRIVKEY = ['0xCB67CC05DBDD1E0BB3DA9231F8A0E0C6E7239C568C6081959AE5F3D20B1F7F4A']

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
  },
};

export default config;
