// Mock the import of plotly to avoid import failures in non-browser context
jest.mock("plotly.js", () => ({
    react: jest.fn()
}));
/* eslint-disable import/first */
import Vue from "vue";
import Vuex from "vuex";
import { shallowMount } from "@vue/test-utils";
import Home from "@/views/Home.vue";
import Charts from "@/components/charts/Charts.vue";
import Parameters from "@/components/parameters/Parameters.vue";
import { RootState } from "@/store/state";
import { getters } from "@/store";
import { mockRootState } from "../../mocks";

describe("Home", () => {
    it("gets metadata and results on mount", () => {
        const mockGetMetadata = jest.fn();
        const mockGetResults = jest.fn();
        const store = new Vuex.Store<RootState>({
            state: mockRootState(),
            actions: {
                getMetadata: mockGetMetadata,
                getResults: mockGetResults
            }
        });

        shallowMount(Home, { store });

        expect(mockGetMetadata.mock.calls.length).toBe(1);
        expect(mockGetResults.mock.calls.length).toBe(1);
    });

    it("renders Charts and Parameters component with expected props", () => {
        const store = new Vuex.Store<RootState>({
            state: mockRootState({
                metadata: {
                    charts: [
                        { value: "metadata" }
                    ],
                    parameterGroups: [
                        { value: "paramMetadata" }
                    ]
                } as any,
                results: { value: "results" },
                paramValues: { value: "paramValue" }
            }),
            getters
        });

        const wrapper = shallowMount(Home, { store });
        const charts = wrapper.findComponent(Charts);
        expect(charts.props("chartMetadata")).toStrictEqual([{ value: "metadata" }]);
        expect(charts.props("chartData")).toStrictEqual({ value: "results" });
        expect(charts.props("layoutData")).toStrictEqual({
            params: { value: "paramValue" },
            population: 67890000
        });

        const parameters = wrapper.findComponent(Parameters);
        expect(parameters.props("paramGroupMetadata")).toStrictEqual([
            { value: "paramMetadata" }
        ]);
        expect(parameters.props("paramValues")).toStrictEqual({ value: "paramValue" });
    });

    it("does not render Charts or Parameters component if no metadata", () => {
        const store = new Vuex.Store<RootState>({
            state: mockRootState({
                metadata: null,
                results: { value: "results" },
                paramValues: { value: "chartLayoutData" }
            })
        });

        const wrapper = shallowMount(Home, { store });
        const charts = wrapper.findComponent(Charts);
        expect(charts.exists()).toBe(false);

        const parameters = wrapper.findComponent(Parameters);
        expect(parameters.exists()).toBe(false);
    });

    it("renders fetching results indicator only when fetching results", () => {
        let store = new Vuex.Store<RootState>({ state: mockRootState() });
        let wrapper = shallowMount(Home, { store });
        expect(wrapper.find("#fetching-results").exists()).toBe(false);

        store = new Vuex.Store<RootState>({
            state: mockRootState({
                fetchingResults: true
            })
        });
        wrapper = shallowMount(Home, { store });
        const fetchingResults = wrapper.find("#fetching-results");
        expect(fetchingResults.text()).toBe("Updating analysis...");
        expect(fetchingResults.find("loading-spinner-stub").exists()).toBe(true);
    });

    it("commits parameter metadata on update emitted from Parameters", async () => {
        const mockSetParameterMetadata = jest.fn();
        const store = new Vuex.Store<RootState>({
            state: mockRootState({
                metadata: {} as any
            }),
            mutations: {
                setParameterMetadata: mockSetParameterMetadata
            }
        });

        const wrapper = shallowMount(Home, { store });
        const mockParameterMetadata = [{ id: "grp1" }];
        const parameters = wrapper.findComponent(Parameters);
        parameters.vm.$emit("updateMetadata", mockParameterMetadata);
        await Vue.nextTick();
        expect(mockSetParameterMetadata.mock.calls.length).toBe(1);
        expect(mockSetParameterMetadata.mock.calls[0][1]).toBe(mockParameterMetadata);
    });

    it("dispatches updateParameterValues on update emitted from Parameters", async () => {
        const mockUpdateParameterValues = jest.fn();
        const store = new Vuex.Store<RootState>({
            state: mockRootState({
                metadata: {} as any
            }),
            actions: {
                updateParameterValues: mockUpdateParameterValues
            }
        });
        const wrapper = shallowMount(Home, { store });
        const mockParameterValues = { grp1: { param1: "value1" } };
        const parameters = wrapper.findComponent(Parameters);
        parameters.vm.$emit("updateValues", mockParameterValues);
        await Vue.nextTick();
        expect(mockUpdateParameterValues.mock.calls.length).toBe(1);
        expect(mockUpdateParameterValues.mock.calls[0][1]).toBe(mockParameterValues);
    });
});
