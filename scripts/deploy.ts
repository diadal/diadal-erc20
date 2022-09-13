import { ethers } from "hardhat";

async function main() {

  const [signer1, signer2] = await ethers.getSigners();

  // console.log("signer2: ", signer2);
  // console.log("signer1: ", signer1);

  const Bank = await ethers.getContractFactory("Bank", signer1);
  const bankContract = await Bank.deploy();

  const Matic = await ethers.getContractFactory("Matic", signer2);
  const matic = await Matic.deploy();
  const Shib = await ethers.getContractFactory("Shib", signer2);
  const shib = await Shib.deploy();
  const Usdt = await ethers.getContractFactory("Usdt", signer2);
  const usdt = await Usdt.deploy();

  await bankContract.whitelistToken(
    ethers.utils.formatBytes32String("Matic"),
    matic.address
  );

  await bankContract.whitelistToken(
    ethers.utils.formatBytes32String("Shib"),
    shib.address
  );

  await bankContract.whitelistToken(
    ethers.utils.formatBytes32String("Usdt"),
    usdt.address
  );

  await bankContract.whitelistToken(
    ethers.utils.formatBytes32String("Eth"),
    "0x09B5DC75789389d1627879bA194874F459364859"
  );

  console.log("Bank deployed to:", bankContract.address, "by", signer1.address);
  console.log("Matic deployed to:", matic.address, "by", signer2.address);
  console.log("Shib deployed to:", shib.address, "by", signer2.address);
  console.log("Tether deployed to:", usdt.address, "by", signer2.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
