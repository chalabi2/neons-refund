import { ethers } from "hardhat";
import { getAddresses } from "../utils/addressStorage";

export async function CallRefund() {
  const childAddresses = getAddresses(); 

  const signer = (await ethers.getSigners())[0];

  for (const childAddress of childAddresses) {
    const RefundBatch = await ethers.getContractFactory("RefundBatch");
    const childContract = RefundBatch.attach(childAddress);

    console.log(`Calling disburse function in Child at address: ${childAddress}`);
    const childContractWithSigner = childContract.connect(signer);
    const receipt = await childContractWithSigner.disburse();
    await receipt.wait();
    console.log(`Disburse function in Child at address: ${childAddress} executed successfully.`);
  }
}

CallRefund()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
