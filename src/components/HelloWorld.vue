<script setup lang="ts">
import { Contract, ethers } from "ethers";
import bankArtifact from "../artifacts/contracts/Bank.sol/Bank.json";
import maticArtifact from "../artifacts/contracts/Matic.sol/Matic.json";
import shibArtifact from "../artifacts/contracts/Shib.sol/Shib.json";
import usdtArtifact from "../artifacts/contracts/Usdt.sol/Usdt.json";
import { defineAsyncComponent, markRaw, onMounted, provide, ref } from "vue";
import { JsonRpcSigner, Web3Provider } from "@ethersproject/providers";

const CardModal = defineAsyncComponent(() => import("./CardModal.vue"));

const provider = ref<Web3Provider>(<Web3Provider>(<unknown>{}));
const signer = ref<JsonRpcSigner>(<JsonRpcSigner>(<unknown>{}));
const signerAddress = ref("");
const error = ref("");
const bankContract = ref<Contract>(<Contract>(<unknown>{}));
const tokenContracts = ref<{ [key: string]: Contract }>({});
const tokenBalances = ref({});
const tokenSymbols = ref<string[]>([]);

const amount = ref(0);
const showModal = ref(false);
const selectedSymbol = ref("");
const isDeposit = ref(true);

const toBytes32 = (text: string) => ethers.utils.formatBytes32String(text);
const toString = (bytes32: ethers.utils.BytesLike) =>
  ethers.utils.parseBytes32String(bytes32);
const toWei = (ether: string) => ethers.utils.parseEther(ether);
const toEther = (wei: ethers.BigNumberish) =>
  ethers.utils.formatEther(wei).toString();
const toRound = (num: number) => Number(num).toFixed(2);

async function useStarter() {
  provider.value = markRaw(new ethers.providers.Web3Provider(window.ethereum));

  bankContract.value = markRaw(
    new ethers.Contract(
      "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707",
      bankArtifact.abi
    )
  );

  const connect = markRaw(bankContract.value);

  await connect
    .connect(provider.value)
    .getWhitelistedSymbols()
    .then((result: ethers.utils.BytesLike[]) => {
      tokenSymbols.value = result.map((s: ethers.utils.BytesLike) =>
        toString(s)
      );
      getTokenContracts();
    });
}

const getTokenContract = async (symbol: string) => {
  const address = await bankContract.value
    .connect(provider.value)
    .getWhitelistedTokenAddress(toBytes32(symbol));
  const abi =
    symbol === "Matic"
      ? maticArtifact.abi
      : symbol === "Shib"
      ? shibArtifact.abi
      : usdtArtifact.abi;
  const tokenContract = markRaw(new ethers.Contract(address, abi));
  return tokenContract;
};

const getTokenContracts = async () => {
  tokenSymbols.value.map(async (symbol: any) => {
    const contract = await getTokenContract(symbol);
    tokenContracts.value = { ...tokenContracts.value, [symbol]: contract };
  });
};

const isConnected = () =>
  signer.value !== undefined && Object.keys(signer.value)?.length > 0;

const getSigner = async () => {
  provider.value.send("eth_requestAccounts", []);
  const signer = provider.value.getSigner();

  signer.getAddress().then((address: string) => {
    signerAddress.value = address;
  });

  return signer;
};

const Connecter = () => {
  getSigner().then((signerX) => {
    signer.value = signerX;
    getTokenBalances();
  });
};

const getTokenBalance = async (symbol: string) => {
  const balance = await bankContract.value
    .connect(signer.value)
    .getTokenBalance(toBytes32(symbol));
  return toEther(balance);
};

const getTokenBalances = () => {
  tokenSymbols.value.map(async (symbol: string) => {
    const balance = await getTokenBalance(symbol);
    tokenBalances.value = {
      ...tokenBalances.value,
      [symbol]: balance.toString(),
    };
  });
};

const displayModal = (symbol: string) => {
  selectedSymbol.value = symbol;
  showModal.value = true;
};

const depositTokens = async (wei: ethers.BigNumber, symbol: string) => {
  const signerX = signer.value;
  const adddress = bankContract.value.address;
  if (symbol === "Eth") {
    signerX.sendTransaction({
      to: adddress,
      value: wei,
    });
  } else {
    const contnetorX = tokenContracts.value[symbol];
    await contnetorX
      .connect(signerX)
      .approve(adddress, wei)
      .then((rep: any) => {
        console.log("rep: ", rep);
        bankContract.value
          .connect(signerX)
          .depositTokens(wei, toBytes32(symbol));
      });
  }
};

const withdrawTokens = (wei: ethers.BigNumber, symbol: string) => {
  if (symbol === "Eth") {
    bankContract.value.connect(signer.value).withdrawEther(wei);
  } else {
    bankContract.value
      .connect(signer.value)
      .withdrawTokens(wei, toBytes32(symbol));
  }
};

const depositOrWithdraw = (symbol: string) => {
  if (amount.value > 0) {
    const wei = toWei(String(amount.value));
    if (isDeposit.value) {
      depositTokens(wei, symbol);
    } else {
      withdrawTokens(wei, symbol);
    }
  } else {
    error.value = "Amount must greater than 0";
  }
};

provide("Amount", amount);
provide("Error", error);
provide("DepositOrWithdraw", depositOrWithdraw);
provide("ShowModal", showModal);
provide("IsDeposit", isDeposit);

onMounted(async () => {
  await useStarter();
});
</script>

<template>
  <div class="App">
    <div class="App-header">
      <div v-if="isConnected()">
        <p>Welcome {{ signerAddress?.substring(0, 10) }}...</p>
        <div v-if="!showModal">
          <div class="list-group">
            <div
              class="list-group-item"
              v-for="(amount, symbol) in tokenBalances"
              :key="symbol"
            >
              <div class="row d-flex py-3" key="{idx}">
                <div class="col-md-3">
                  <div>{{ symbol.toUpperCase() }}</div>
                </div>

                <div class="d-flex gap-4 col-md-3">
                  <small class="opacity-50 text-nowrap">
                    {{ toRound(amount) }}
                  </small>
                </div>

                <div class="d-flex gap-4 col-md-6">
                  <button @click="displayModal(symbol)" class="btn btn-primary">
                    Deposit/Withdraw
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <CardModal :symbol="selectedSymbol" v-else />
      </div>

      <div v-else>
        <p>You are not connected</p>
        <button @click="Connecter" class="btn btn-primary">
          Connect Metamask
        </button>
      </div>
    </div>
  </div>
</template>
