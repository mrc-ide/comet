import Vue from "vue";
import Vuex from "vuex";
import { actions } from "@/store/actions";
import { getters, forecastDays } from "@/store/getters";
import { mutations } from "@/store/mutations";
import { RootState } from "@/store/state";
import CompositionApi from "@vue/composition-api";

Vue.use(Vuex);
Vue.use(CompositionApi);

export default new Vuex.Store<RootState>({
    state: {
        apiInfo: null,
        metadata: null,
        results: null,
        errors: [],
        // This auxiliary data required by charts will eventually come out of dynamic parameters
        paramValues: {
            region: "GBR",
            healthcare: {
                generalBeds: 314310,
                criticalBeds: 11350
            },
            vaccination: {
                efficacyInfection: 0.9,
                efficacyDisease: 0.96,
                maxDosesPerWeek: null,
                strategy: "HCW and Elderly",
                uptake: 0.2,
                availability: 0.9,
                durability: 1095,
                riskProportion: 0.1,
                future: null
            },
            rt: [
                {
                    start: "2021-04-30",
                    value: 1.18
                },
                {
                    start: "2021-10-31",
                    value: 2.40
                }
            ],
            simulation: {
                forecastDays
            }
        },
        fetchingResults: false
    },
    getters,
    mutations,
    actions,
    modules: {}
});
