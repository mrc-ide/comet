import axios from "axios";
import { ActionTree } from "vuex";
import { RootState } from "@/store/state";
import { ParameterGroupJsonataMetadata } from "@/types";
import jsonata from "jsonata";

export const actions: ActionTree<RootState, RootState> = {
    async getApiInfo({ commit }) {
        const { data } = await axios.get("/api-info");
        commit("setApiInfo", data.data);
    },
    async getMetadata({ commit }) {
        const { data } = await axios.get("/metadata");

        // populate any dynamic values in the config by evaluating the jsonata
        data.data.parameterGroups = data.data.parameterGroups
            .map((g: ParameterGroupJsonataMetadata) => {
                return { ...g, config: jsonata(g.config).evaluate({}) };
            });

        commit("setMetadata", data.data);
    },
    async getResults({ commit, state }) {
        const { data } = await axios.post("/results", state.paramValues);
        commit("setResults", data.data);
    },
    async updateParameterValues({ commit, dispatch }, newValues) {
        commit("setParameterValues", newValues);
        dispatch("getResults");
    }
};
