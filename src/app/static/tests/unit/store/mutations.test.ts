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
});
