import { RootState } from "@/store/state";
import {
    ApiInfo,
    Metadata,
    Data,
    ParameterGroupMetadata
} from "@/types";

export const mutations = {
    setApiInfo(state: RootState, apiInfo: ApiInfo): void {
        state.apiInfo = apiInfo;
    },
    setMetadata(state: RootState, metadata: Metadata): void {
        state.metadata = metadata;
    },
    setResults(state: RootState, results: Data): void {
        state.results = results;
    },
    setParameterMetadata(state: RootState, paramMetadata: Array<ParameterGroupMetadata>): void {
        state.metadata!.parameterGroups = paramMetadata;
    },
    setParameterValues(state: RootState, paramValues: Data): void {
        state.paramValues = paramValues;
    },
    setFetchingResults(state: RootState, fetchingResults: boolean): void {
        state.fetchingResults = fetchingResults;
    }
};
