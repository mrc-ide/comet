import axios, {AxiosError} from "axios";
import { ActionTree } from "vuex";
import { RootState } from "@/store/state";
import { ParameterGroupJsonataMetadata } from "@/types";
import jsonata from "jsonata";

export const actions: ActionTree<RootState, RootState> = {
    async getApiInfo({ commit }) {
        await axios.get("/api-info")
          .then(({ data }) => {
              commit("setApiInfo", data.data);
          });
    },
    async getMetadata({ commit }) {
        await axios.get("/metadata")
          .then(({ data })=> {
              // populate any dynamic values in the config by evaluating the jsonata
              data.data.parameterGroups = data.data.parameterGroups
                .map((g: ParameterGroupJsonataMetadata) => {
                  return { ...g, config: jsonata(g.config).evaluate({}) };
                });

              commit("setMetadata", data.data);
          }).catch(({ response }) => {
              commit("setErrors", response.data && response.data.errors);
              //TODO: Could be message if no response from server - handle in common method
          });
    },
    async getResults({ commit, state }) {
        commit("setFetchingResults", true);
        await axios.post("/results", state.paramValues)
          .then(({ data }) => {
              commit("setResults", data.data);
          }).catch(({ response }) => {
              commit("setErrors", response.data && response.data.errors);
          });

        commit("setFetchingResults", false);
    },
    async updateParameterValues({ commit, dispatch }, newValues) {
        commit("setParameterValues", newValues);
        dispatch("getResults");
    }
};
