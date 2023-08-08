import hre from 'hardhat';

async function main() {
  const networkName = hre.network.name;
  const accounts = await hre.ethers.getSigners();
  
  console.log(`Network: ${networkName}`);
  console.log('Accounts:', accounts.map(account => account.address));
}

main().catch(console.error);
