import { actions } from "@/store/actions";
import {mockAxios, mockRootState, mockSuccess} from "../../mocks";

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
        mockAxios.onPost("/results")
            .reply(200, mockSuccess(mockResults));
        const state = mockRootState({ paramValues: { param1: "value1" } });

        const commit = jest.fn();
        await (actions.getResults as any)({ commit, state });

        expect(JSON.parse(mockAxios.history.post[0].data)).toStrictEqual({ param1: "value1"});

        expect(commit.mock.calls.length).toBe(1);
        expect(commit.mock.calls[0][0]).toBe("setResults");
        expect(commit.mock.calls[0][1]).toStrictEqual(mockResults);
    });
});
