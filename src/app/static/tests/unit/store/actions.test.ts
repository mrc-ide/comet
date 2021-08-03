import { actions, commitErrors } from "@/store/actions";
import {
    mockAxios,
    mockFailure,
    mockRootState,
    mockSuccess
} from "../../mocks";

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

    it("fetches countries", async () => {
        const mockCountries = [{ code: "NARN", name: "Narnia", public: true }];
        mockAxios.onGet("/countries")
            .reply(200, mockSuccess(mockCountries));
        const commit = jest.fn();

        await (actions.getCountries as any)({ commit });
        expect(commit.mock.calls.length).toBe(1);
        expect(commit.mock.calls[0][0]).toBe("setCountries");
        expect(commit.mock.calls[0][1]).toStrictEqual(mockCountries);
    });

    it("fetches results", async () => {
        const mockResults = { time_series: [] };
        mockAxios.onPost("/results")
            .reply(200, mockSuccess(mockResults));
        const state = mockRootState({ paramValues: { param1: "value1" } });

        const commit = jest.fn();
        await (actions.getResults as any)({ commit, state });

        expect(JSON.parse(mockAxios.history.post[0].data)).toStrictEqual({ param1: "value1" });

        expect(commit.mock.calls.length).toBe(4);
        expect(commit.mock.calls[0][0]).toBe("setFetchingResults");
        expect(commit.mock.calls[0][1]).toBe(true);
        expect(commit.mock.calls[1][0]).toBe("setErrors");
        expect(commit.mock.calls[1][1]).toStrictEqual([]);
        expect(commit.mock.calls[2][0]).toBe("setResults");
        expect(commit.mock.calls[2][1]).toStrictEqual(mockResults);
        expect(commit.mock.calls[3][0]).toBe("setFetchingResults");
        expect(commit.mock.calls[3][1]).toBe(false);
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

    it("get metadata commits errors", async () => {
        mockAxios.onGet("/metadata")
            .reply(400, mockFailure("Metadata failed"));

        const commit = jest.fn();
        await (actions.getMetadata as any)({ commit });
        expect(commit.mock.calls.length).toBe(1);
        expect(commit.mock.calls[0][0]).toBe("setErrors");
        expect(commit.mock.calls[0][1]).toStrictEqual(
            [{ error: "OTHER_ERROR", detail: "Metadata failed" }]
        );
    });

    it("get countries commits errors", async () => {
        mockAxios.onGet("/countries")
            .reply(400, mockFailure("Countries failed"));

        const commit = jest.fn();
        await (actions.getCountries as any)({ commit });
        expect(commit.mock.calls.length).toBe(1);
        expect(commit.mock.calls[0][0]).toBe("setErrors");
        expect(commit.mock.calls[0][1]).toStrictEqual(
            [{ error: "OTHER_ERROR", detail: "Countries failed" }]
        );
    });

    it("gets api info", async () => {
        const mockApiInfo = {
            name: "cometr",
            version: {
                cometr: "0.1.0",
                nimue: "0.2.0"
            }
        };
        mockAxios.onGet("/api-info")
            .reply(200, mockSuccess(mockApiInfo));
        const commit = jest.fn();
        await (actions.getApiInfo as any)({ commit });
        expect(commit.mock.calls.length).toBe(1);
        expect(commit.mock.calls[0][0]).toBe("setApiInfo");
        expect(commit.mock.calls[0][1]).toStrictEqual(mockApiInfo);
    });

    it("get results commits errors", async () => {
        mockAxios.onPost("/results").networkError();

        const commit = jest.fn();
        const state = mockRootState();
        await (actions.getResults as any)({ commit, state });

        expect(commit.mock.calls.length).toBe(4);
        expect(commit.mock.calls[0][0]).toBe("setFetchingResults");
        expect(commit.mock.calls[0][1]).toBe(true);
        expect(commit.mock.calls[1][0]).toBe("setErrors");
        expect(commit.mock.calls[1][1]).toStrictEqual([]);
        expect(commit.mock.calls[2][0]).toBe("setErrors");
        expect(commit.mock.calls[2][1]).toStrictEqual([{ error: "Network Error" }]);
        expect(commit.mock.calls[3][0]).toBe("setFetchingResults");
        expect(commit.mock.calls[3][1]).toBe(false);
    });

    it("get api info commits errors", async () => {
        const commit = jest.fn();
        await (actions.getApiInfo as any)({ commit });
        expect(commit.mock.calls.length).toBe(1);
        expect(commit.mock.calls[0][0]).toBe("setErrors");
        expect(commit.mock.calls[0][1]).toStrictEqual([
            { error: "Request failed with status code 404" }
        ]);
    });

    it("commitErrors commits empty error", () => {
        const commit = jest.fn();
        commitErrors({} as any, commit);
        expect(commit.mock.calls.length).toBe(1);
        expect(commit.mock.calls[0][0]).toBe("setErrors");
        expect(commit.mock.calls[0][1]).toStrictEqual([
            { error: "Unable to contact server" }
        ]);
    });

    it("commitErrors commits 'error' on response data'", () => {
        const commit = jest.fn();
        commitErrors({
            response: {
                data: {
                    error: "Test Error"
                }
            }
        } as any, commit);
        expect(commit.mock.calls.length).toBe(1);
        expect(commit.mock.calls[0][0]).toBe("setErrors");
        expect(commit.mock.calls[0][1]).toStrictEqual([
            { error: "Test Error" }
        ]);
    });
});
