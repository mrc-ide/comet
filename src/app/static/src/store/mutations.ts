import { RootState } from "@/store/state";
import {
    ApiInfo,
    Metadata,
    Data,
    ParameterGroupMetadata,
    ErrorInfo,
    Country
} from "@/types";

export const mutations = {
    setApiInfo(state: RootState, apiInfo: ApiInfo): void {
        state.apiInfo = apiInfo;
    },
    setMetadata(state: RootState, metadata: Metadata): void {
        state.metadata = metadata;
    },
    setCountries(state: RootState, countries: Country[]): void {
        state.countries = countries;
    },
    setResults(state: RootState, results: Data): void {
        state.results = results;
    },
    setParameterMetadata(state: RootState, paramMetadata: ParameterGroupMetadata[]): void {
        state.metadata!.parameterGroups = paramMetadata;
    },
    setParameterValues(state: RootState, paramValues: Data): void {
        state.paramValues = paramValues;
    },
    setFetchingResults(state: RootState, fetchingResults: boolean): void {
        state.fetchingResults = fetchingResults;
    },
    setErrors(state: RootState, errors: ErrorInfo[]): void {
        state.errors = errors;
    }
};
