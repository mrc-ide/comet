// Mock the import of plotly to avoid import failures in non-browser context
jest.mock('plotly.js', () => ({
  react: jest.fn()
}))
import { createStore } from "vuex";
import { shallowMount } from "@vue/test-utils";
import Home from "@/views/Home.vue";
import Charts from "@/components/charts/Charts.vue";
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

    it("renders Charts component with expected props", () => {
        const $store = createStore({
          state: mockRootState({
              metadata: {charts: [{value: "metadata"}]} as any,
              results: {value: "results"},
              chartLayoutData: {value: "chartLayoutData"}
          })
        });

        const wrapper = shallowMount(Home, {
          global: { mocks: { $store } }
        });
        const charts = wrapper.findComponent(Charts);
        expect(charts.props("chartMetadata")).toStrictEqual([{value: "metadata"}]);
        expect(charts.props("chartData")).toStrictEqual({value: "results"});
        expect(charts.props("layoutData")).toStrictEqual({value: "chartLayoutData"});
    });

    it("does not render Charts component if no metadata", () => {
        const $store = createStore({
            state: mockRootState({
                metadata: null,
                results: {value: "results"},
                chartLayoutData: {value: "chartLayoutData"}
            })
        });

        const wrapper = shallowMount(Home, {
          global: { mocks: { $store } }
        });
        const charts = wrapper.findComponent(Charts);
        expect(charts.exists()).toBe(false);
    });
});
