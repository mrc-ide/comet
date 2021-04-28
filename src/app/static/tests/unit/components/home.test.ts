import { createStore } from "vuex";
import { shallowMount } from "@vue/test-utils";
import Home from "@/views/Home.vue";
import { mockRootState } from "../../mocks";

describe("Home", () => {
    it("gets metadata and results on mount", () => {
        const mockGetMetadata = jest.fn();
        const mockGetResults = jest.fn();
        const $store = createStore({
            state: mockRootState(),
            actions: {
                getMetadata: mockGetMetadata,
                getResults: mockGetResults
            }
        });

        shallowMount(Home, {
            global: { mocks: { $store } }
        });

        expect(mockGetMetadata.mock.calls.length).toBe(1);
        expect(mockGetResults.mock.calls.length).toBe(1);
    });
});
