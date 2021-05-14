import { RootState } from "@/store/state";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { ApiError, ApiResponse } from "@/types";

export const mockAxios = new MockAdapter(axios);

export const mockSuccess = (data: unknown): ApiResponse => {
    return {
        data,
        status: "success",
        errors: null
    };
};

export const mockError = (errorMessage: string): ApiError => {
    return { error: "OTHER_ERROR", detail: errorMessage };
};

export const mockFailure = (errorMessage: string): ApiResponse => {
    return {
        data: null,
        status: "failure",
        errors: [mockError(errorMessage)]
    };
};

export function mockRootState(state: Partial<RootState> = {}): RootState {
    return {
        apiInfo: null,
        metadata: null,
        results: null,
        paramValues: null,
        fetchingResults: false,
        ...state
    };
}
