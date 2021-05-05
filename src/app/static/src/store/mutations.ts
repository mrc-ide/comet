import { RootState } from "@/store/state";
import { ApiInfo, Metadata, Data } from "@/types";

export const mutations = {
    setApiInfo(state: RootState, apiInfo: ApiInfo): void {
        state.apiInfo = apiInfo;
    },
    setMetadata(state: RootState, metadata: Metadata): void {
        state.metadata = metadata;
    },
    setResults(state: RootState, results: Data): void {
        state.results = results;
    }
};
