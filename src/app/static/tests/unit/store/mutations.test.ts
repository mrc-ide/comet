import {mockRootState} from "../../mocks";
import {mutations} from "@/store/mutations";

describe("mutations", () => {
    it("sets metadata", () => {
        const state = mockRootState();
        const mockMetadata = { charts: [] };
        mutations.setMetadata(state, mockMetadata);
        expect(state.metadata).toBe(mockMetadata);
  });
});
