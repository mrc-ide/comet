import { RootState } from "@/store/state";
import {
  ApiInfo,
  Metadata,
  Data,
  ParameterGroupMetadata,
  ErrorInfo,
  Country, ParameterValues
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
    setParameterValues(state: RootState, paramValues: ParameterValues): void {
        state.paramValues = paramValues;
    },
    setCountry(state: RootState, countryCode: string): void {
        state.paramValues!.region = countryCode;
        const country = state.countries!.find(country => country.code == countryCode)!;
        //Because parameter values are kept separately from the metaata for dyanmic form used
        //to update those values, we need to update them both
        state.paramValues!.healthcare.generalBeds = country.capacityGeneral;
        state.paramValues!.healthcare.criticalBeds = country.capacityICU;

    },
    setFetchingResults(state: RootState, fetchingResults: boolean): void {
        state.fetchingResults = fetchingResults;
    },
    setErrors(state: RootState, errors: ErrorInfo[]): void {
        state.errors = errors;
    }
};
