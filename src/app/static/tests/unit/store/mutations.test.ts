import { mutations } from "@/store/mutations";
import { mockRootState } from "../../mocks";

describe("mutations", () => {
    it("sets metadata", () => {
        const state = mockRootState();
        const mockMetadata = { charts: [] };
        mutations.setMetadata(state, mockMetadata);
        expect(state.metadata).toBe(mockMetadata);
    });
});
