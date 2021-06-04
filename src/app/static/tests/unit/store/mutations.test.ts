import { mutations } from "@/store/mutations";
import { mockRootState } from "../../mocks";

describe("mutations", () => {
    it("sets metadata", () => {
        const state = mockRootState();
        const mockMetadata = { charts: [], parameterGroups: [] };
        mutations.setMetadata(state, mockMetadata);
        expect(state.metadata).toBe(mockMetadata);
    });

    it("sets results", () => {
        const state = mockRootState();
        const mockResults = { time_series: [] };
        mutations.setResults(state, mockResults);
        expect(state.results).toBe(mockResults);
    });

    it("sets parameter metadata", () => {
        const state = mockRootState({ metadata: { charts: [], parameterGroups: [] } as any });
        const newParamMetadata = [
            { id: "group1" },
            { id: "group2" }
        ];
        mutations.setParameterMetadata(state, newParamMetadata as any);
        expect(state.metadata).toStrictEqual({
            charts: [],
            parameterGroups: newParamMetadata
        });
    });

    it("sets parameter values", () => {
        const state = mockRootState();
        const mockParamValues = { grp1: { param1: "value1" } };
        mutations.setParameterValues(state, mockParamValues);
        expect(state.paramValues).toBe(mockParamValues);
    });

    it("sets fetchingResults", () => {
        const state = mockRootState();
        mutations.setFetchingResults(state, true);
        expect(state.fetchingResults).toBe(true);
    });

    it("sets errors", () => {
        const state = mockRootState();
        const errors = [{ error: "an error" }];
        mutations.setErrors(state, errors);
        expect(state.errors).toBe(errors);
    });
});
