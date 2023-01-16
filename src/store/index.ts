import Vue from "vue";
import Vuex from "vuex";
import { arweave, warp } from "../environment";
import { deployedContracts } from "../deployed-contracts";
import { PstState } from "@/contracts/types/types";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    arweave,
    warp,
    state: {},
    contract: null,
    walletAddress: null,
  },
  mutations: {
    setState(state, swState) {
      state.state = swState;
    },
    setContract(state, contract) {
      state.contract = contract;
    },
    setWalletAddress(state, walletAddress) {
      state.walletAddress = walletAddress;
    },
  },
  actions: {
    async loadState({ commit }) {
      // ~~ Generate arweave wallet ~~
      const wallet = await arweave.wallets.generate();

      // ~~ Get wallet address and mint some tokens ~~
      const walletAddress = await arweave.wallets.getAddress(wallet);

      // ~~ Connect deployed contract and wallet ~~
      const contract = warp.pst(deployedContracts.fc).connect(wallet);
      commit("setContract", contract);

      // ~~ Set the state of the contract ~~
      const { cachedValue } = await contract.readState();
      commit("setState", cachedValue.state);
      commit("setWalletAddress", walletAddress);
    },
  },
  modules: {},
});
