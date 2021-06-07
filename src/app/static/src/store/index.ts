import Vue from "vue";
import Vuex from "vuex";
import { actions } from "@/store/actions";
import { mutations } from "@/store/mutations";
import { RootState } from "@/store/state";
import { Data } from "@/types";
import CompositionApi from "@vue/composition-api";
import dayjs from "dayjs";

Vue.use(Vuex);
Vue.use(CompositionApi);

export const getters = {
    chartLayoutData: (state: RootState): Data => {
        return {
            params: state.paramValues,
            // This is not a parameter, cannot be edited - will come from cometr regions endpoint
            population: 67890000
        };
    }
};

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
                    start: dayjs().format("YYYY-MM-DD"),
                    value: 1.18
                },
                {
                    start: dayjs().add(184, "day").format("YYYY-MM-DD"),
                    value: 2.40
                }
            ],
            simulation: {
                forecastDays: 730
            }
        },
        fetchingResults: false
    },
    getters,
    mutations,
    actions,
    modules: {}
});
