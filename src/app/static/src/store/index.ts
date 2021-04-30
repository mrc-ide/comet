import { createStore } from "vuex";
import { actions } from "@/store/actions";
import { mutations } from "@/store/mutations";
import { RootState } from "@/store/state";

const getters = {
    chartLayoutData: (state: RootState) => {
        return {
            params: state.paramValues,
            //This is not a parameter, cannot be edited - will come from cometr regions endpoint
            population: 67890000
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
            "region": "GBR",
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
                  "start": "2021-04-30",
                  "value": 1.18
              },
              {
                  "start": "2021-10-31",
                  "value": 2.40
              }

            ],
            "simulation": {
              "forecastDays": 1095
            }
        }
    },
    getters,
    mutations,
    actions,
    modules: {}
});
