import { ethers } from "hardhat";
import * as ABI  from "../../contracts/NounsDAOLogicV1ABI.json";

async function main() {
    const contractABI = ABI.abi;
    const iface = new ethers.utils.Interface(contractABI);

    const data = '0x0000000000000000000000000000000000000000000000000000000045c31c00'; // The long encoded data string you've provided
    const decodedData = iface.decodeFunctionData("propose", data);

    console.log(decodedData);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
