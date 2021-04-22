import {RootState} from "@/store";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import {ApiError, ApiResponse} from "@/types";

export const mockAxios = new MockAdapter(axios);

export const mockSuccess = (data: any): ApiResponse => {
  return {
    data,
    status: "success",
    errors: null
  }
};

export const mockFailure = (errorMessage: string): ApiResponse => {
  return {
    data: null,
    status: "failure",
    errors: [mockError(errorMessage)]
  }
};

export const mockError = (errorMessage: string): ApiError => {
  return {error: "OTHER_ERROR", detail: errorMessage};
};

export function mockRootState(state: Partial<RootState> = {}): RootState {
  return {
    count: 0,
    apiInfo: null,
    metadata: null,
    ...state
  }
}
