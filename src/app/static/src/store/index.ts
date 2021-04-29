import { createStore } from "vuex";
import { actions } from "@/store/actions";
import { mutations } from "@/store/mutations";
import { RootState } from "@/store/state";

const getters = {
    chartLayout: (state: RootState) => {
        return {
            params: state.paramValues
        }
    }
};

export default createStore<RootState>({
    state: {
        apiInfo: null,
        metadata: null,
        results: null,
        // This auxiliary data required by charts will eventually come out of dynamic parameters
        paramValues: {
            "region": "TEST",
            "healthcare": {
              "generalBeds": 314310,
              "criticalBeds": 11350
            },
            "vaccination": {
              "efficacyInfection": 0.9,
              "efficacyDisease": 0.96,
              "maxDosesPerWeek": null,
              "strategy": "HCW and Elderly",
              "uptake": 0.2,
              "availability": 0.9,
              "durability": 1095,
              "riskProportion": 0.1,
              "future": null
            },
            "rt": [
              {
                "start": "2020-04-05",
                "value": 2.4
              }
            ],
            "simulation": {
              "forecastDays": 40
            }
        }
    },
    getters,
    mutations,
    actions,
    modules: {}
});
