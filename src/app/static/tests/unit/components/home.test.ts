import { createStore } from "vuex";
import { shallowMount } from "@vue/test-utils";
import Home from "@/views/Home.vue";
import { mockRootState } from "../../mocks";

describe("Home", () => {
    it("gets metadata on mount", () => {
        const mockGetMetadata = jest.fn();
        const $store = createStore({
            state: mockRootState(),
            actions: {
                getMetadata: mockGetMetadata
            }
        });

        shallowMount(Home, {
            global: { mocks: { $store } }
        });

        expect(mockGetMetadata.mock.calls.length).toBe(1);
    });
});
