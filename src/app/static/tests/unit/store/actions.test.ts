import { actions } from "@/store/actions";
import { mockAxios, mockSuccess } from "../../mocks";

describe("actions", () => {
    beforeEach(() => {
        mockAxios.reset();
    });

    it("fetches metadata", async () => {
        const mockMetadata = { charts: [] };
        mockAxios.onGet("/metadata")
            .reply(200, mockSuccess(mockMetadata));
        const commit = jest.fn();
        await (actions.getMetadata as any)({ commit });

        expect(commit.mock.calls.length).toBe(1);
        expect(commit.mock.calls[0][0]).toBe("setMetadata");
        expect(commit.mock.calls[0][1]).toStrictEqual(mockMetadata);
    });

    it("fetches results", async () => {
        const mockResults = { time_series: [] };
        mockAxios.onGet("/results")
          .reply(200, mockSuccess(mockResults));
        const commit = jest.fn();
        await (actions.getResults as any)({ commit });

        expect(commit.mock.calls.length).toBe(1);
        expect(commit.mock.calls[0][0]).toBe("setResults");
        expect(commit.mock.calls[0][1]).toStrictEqual(mockResults);
    });
});
