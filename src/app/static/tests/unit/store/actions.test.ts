import { actions } from "@/store/actions";
import { mockAxios, mockRootState, mockSuccess } from "../../mocks";

describe("actions", () => {
    beforeEach(() => {
        mockAxios.reset();
    });

    it("fetches metadata and evaluates paramGroups", async () => {
        const mockMetadata = {
            charts: [],
            parameterGroups: [
                { id: "pg1", config: "{\"value\": 5 + 1}" },
                { id: "pg2", config: "{\"value\": 5 - 1}" }
            ]
        };
        mockAxios.onGet("/metadata")
            .reply(200, mockSuccess(mockMetadata));
        const commit = jest.fn();
        await (actions.getMetadata as any)({ commit });

        expect(commit.mock.calls.length).toBe(1);
        expect(commit.mock.calls[0][0]).toBe("setMetadata");
        expect(commit.mock.calls[0][1]).toStrictEqual({
            charts: [],
            parameterGroups: [
                { id: "pg1", config: { value: 6 } },
                { id: "pg2", config: { value: 4 } }
            ]
        });
    });

    it("fetches results", async () => {
        const mockResults = { time_series: [] };
        mockAxios.onPost("/results")
            .reply(200, mockSuccess(mockResults));
        const state = mockRootState({ paramValues: { param1: "value1" } });

        const commit = jest.fn();
        await (actions.getResults as any)({ commit, state });

        expect(JSON.parse(mockAxios.history.post[0].data)).toStrictEqual({ param1: "value1" });

        expect(commit.mock.calls.length).toBe(3);
        expect(commit.mock.calls[0][0]).toBe("setFetchingResults");
        expect(commit.mock.calls[0][1]).toBe(true);
        expect(commit.mock.calls[1][0]).toBe("setResults");
        expect(commit.mock.calls[1][1]).toStrictEqual(mockResults);
        expect(commit.mock.calls[2][0]).toBe("setFetchingResults");
        expect(commit.mock.calls[2][1]).toBe(false);
    });

    it("updates parameter values", async () => {
        const commit = jest.fn();
        const dispatch = jest.fn();
        const mockParams = {
            grp1: {
                name1: "value1"
            }
        };

        await (actions.updateParameterValues as any)({ commit, dispatch }, mockParams);
        expect(commit.mock.calls.length).toBe(1);
        expect(commit.mock.calls[0][0]).toBe("setParameterValues");
        expect(commit.mock.calls[0][1]).toBe(mockParams);
        expect(dispatch.mock.calls.length).toBe(1);
        expect(dispatch.mock.calls[0][0]).toBe("getResults");
    });
});
