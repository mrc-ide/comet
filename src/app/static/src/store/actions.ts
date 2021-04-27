import axios from "axios";
import { ActionTree } from "vuex";
import { RootState } from "@/store/state";

export const actions: ActionTree<RootState, RootState> = {
    async increment({ commit }) {
        const { data } = await axios.get("/random", { params: { min: 1, max: 10 } });
        const { data: randomAmount } = data;
        commit("increment", randomAmount);
    },
    async getApiInfo({ commit }) {
        const { data } = await axios.get("/api-info");
        commit("setApiInfo", data.data);
    },
    async getMetadata({ commit }) {
        const { data } = await axios.get("/metadata");
        commit("setMetadata", data.data);
    }
};
