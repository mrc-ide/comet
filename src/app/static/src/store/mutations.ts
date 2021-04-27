import { RootState } from "@/store/state";
import {ApiInfo, Metadata, Results} from "@/types";

export const mutations = {
    increment(state: RootState, amount: number): void {
        state.count += amount;
    },
    setApiInfo(state: RootState, apiInfo: ApiInfo): void {
        state.apiInfo = apiInfo;
    },
    setMetadata(state: RootState, metadata: Metadata): void {
        state.metadata = metadata;
    },
    setResults(state: RootState, results: Results): void {
        //TODO: This is temporary - provide hardcoded params until we have real params
        results["params"] = {
            "phases": [
              {
                "start": "2020-01-01T00:00:00.000Z",
                "rt": 1.35
              },
              {
                "start": "2021-03-25T00:00:00.000Z",
                "rt": 2.45
              }
            ],
            "general_beds": 314310,
            "critical_beds": 11350
        };

        state.results = results;
    }
};
