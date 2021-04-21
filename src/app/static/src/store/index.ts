import { createStore } from "vuex";
import axios from "axios";

export default createStore({
    state: {
        count: 0,
        apiInfo: null,
        metadata: null
    },
    mutations: {
        increment(state, amount) {
            state.count += amount;
        },
        setApiInfo(state, apiInfo) {
            state.apiInfo = apiInfo;
        },
        setMetadata(state, metadata) {
          state.metadata = metadata;
        }
    },
    actions: {
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
            commit("setMetadata", data);
        }
    },
    modules: {
    }
});
