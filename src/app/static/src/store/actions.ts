import axios, { AxiosError } from "axios";
import { ActionTree, Commit } from "vuex";
import { RootState } from "@/store/state";
import { ErrorInfo, ParameterGroupJsonataMetadata } from "@/types";
import jsonata from "jsonata";

export function commitErrors(e: AxiosError, commit: Commit): void {
    let errors: ErrorInfo[];
    if (e.response?.data?.errors) {
        errors = e.response.data.errors;
    } else if (e.response?.data?.error) {
        errors = [{ error: e.response.data.error }];
    } else if (e.message) {
        errors = [{ error: e.message }];
    } else {
        errors = [{ error: "Unable to contact server" }];
    }
    commit("setErrors", errors);
}

export const actions: ActionTree<RootState, RootState> = {
    async getApiInfo({ commit }) {
        await axios.get("/api-info")
            .then(({ data }) => {
                commit("setApiInfo", data.data);
            }).catch((e: AxiosError) => {
                commitErrors(e, commit);
            });
    },
    async getMetadata({ commit }) {
        await axios.get("/metadata")
            .then((response) => {
                // populate any dynamic values in the config by evaluating the jsonata
                const { data } = response;
                data.data.parameterGroups = data.data.parameterGroups
                    .map((g: ParameterGroupJsonataMetadata) => {
                        return { ...g, config: jsonata(g.config).evaluate({}) };
                    });

                commit("setMetadata", data.data);
            }).catch((e: AxiosError) => {
                commitErrors(e, commit);
            });
    },
    async getCountries({ commit }) {
        await axios.get("/countries")
            .then((response) => {
                const { data } = response;
                commit("setCountries", data.data);
            }).catch((e: AxiosError) => {
                commitErrors(e, commit);
            });
    },
    async getResults({ commit, state }) {
        commit("setFetchingResults", true);
        commit("setErrors", []);
        await axios.post("/results", state.paramValues)
            .then(({ data }) => {
                commit("setResults", data.data);
            }).catch((e: AxiosError) => {
                commitErrors(e, commit);
            });

        commit("setFetchingResults", false);
    },
    async updateParameterValues({ commit, dispatch }, newValues) {
        commit("setParameterValues", newValues);
        dispatch("getResults");
    },
    async updateCountry({ commit, dispatch }, newValue) {
        commit("setCountry", newValue);
        dispatch("getResults");
    }
};
