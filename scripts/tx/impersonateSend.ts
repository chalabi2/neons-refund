
import { ethers, waffle } from "hardhat";
async function main() {

    const impersonateAddress = "0xD10f179c2D1Cba52e862A02563f416fDA0401396";
    const destinationAddress = "0x3Aa5ebB10DC797CAC828524e59A333d0A371443c"; 


    const amount = ethers.utils.parseEther("697171");  


    const impersonatedSigner = await ethers.getImpersonatedSigner(impersonateAddress);

    const tx = await impersonatedSigner.sendTransaction({
        to: destinationAddress,
        value: amount
    });

    await tx.wait();

    console.log(`Sent ${ethers.utils.formatEther(amount)} ETH to ${destinationAddress}`);
}


main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });