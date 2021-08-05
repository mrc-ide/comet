// Mock the import of plotly to avoid import failures in non-browser context
import { numericFormatter } from "@/components/parameters/phasesUtils";

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
import Errors from "@/components/Errors.vue";
import { RootState } from "@/store/state";
import { getters } from "@/store/getters";
import { mockRootState } from "../../mocks";

describe("Home", () => {
    it("gets metadata, countries and results on mount", () => {
        const mockGetMetadata = jest.fn();
        const mockGetCountries = jest.fn();
        const mockGetResults = jest.fn();
        const store = new Vuex.Store<RootState>({
            state: mockRootState(),
            actions: {
                getMetadata: mockGetMetadata,
                getCountries: mockGetCountries,
                getResults: mockGetResults
            }
        });

        shallowMount(Home, { store });

        expect(mockGetMetadata.mock.calls.length).toBe(1);
        expect(mockGetCountries.mock.calls.length).toBe(1);
        expect(mockGetResults.mock.calls.length).toBe(1);
    });

    it("does not get metadata if already set", () => {
        const mockGetMetadata = jest.fn();
        const mockGetCountries = jest.fn();
        const mockGetResults = jest.fn();
        const store = new Vuex.Store<RootState>({
            state: mockRootState({
                metadata: {
                    charts: []
                } as any
            }),
            actions: {
                getMetadata: mockGetMetadata,
                getCountries: mockGetCountries,
                getResults: mockGetResults
            }
        });

        shallowMount(Home, { store });

        expect(mockGetMetadata.mock.calls.length).toBe(0);
        expect(mockGetCountries.mock.calls.length).toBe(1);
        expect(mockGetResults.mock.calls.length).toBe(1);
    });

    it("does not get countries if already set", () => {
        const mockGetMetadata = jest.fn();
        const mockGetCountries = jest.fn();
        const mockGetResults = jest.fn();
        const store = new Vuex.Store<RootState>({
            state: mockRootState({
                countries: [{
                    code: "NARN", name: "Narnia", public: true, population: 1.0
                }]
            }),
            actions: {
                getMetadata: mockGetMetadata,
                getCountries: mockGetCountries,
                getResults: mockGetResults
            }
        });

        shallowMount(Home, { store });

        expect(mockGetMetadata.mock.calls.length).toBe(1);
        expect(mockGetCountries.mock.calls.length).toBe(0);
        expect(mockGetResults.mock.calls.length).toBe(1);
    });

    it("does not get results if already set", () => {
        const mockGetMetadata = jest.fn();
        const mockGetResults = jest.fn();
        const store = new Vuex.Store<RootState>({
            state: mockRootState({
                results: {
                    timeSeries: []
                } as any
            }),
            actions: {
                getMetadata: mockGetMetadata,
                getResults: mockGetResults
            }
        });

        shallowMount(Home, { store });

        expect(mockGetMetadata.mock.calls.length).toBe(1);
        expect(mockGetResults.mock.calls.length).toBe(0);
    });

    it("renders components with expected props", () => {
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
                paramValues: { value: "paramValue" },
                countries: [{
                    code: "GBR", name: "United Kingdom", public: true, population: 1000000.09
                }]
            }),
            getters: {
                ...getters,
                forecastStart: () => new Date("2021-01-01"),
                forecastEnd: () => new Date("2021-06-01"),
                population: () => numericFormatter(1000000.09)
            }
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
        expect(parameters.props("population")).toStrictEqual("1.00m");
        expect(parameters.props("forecastStart")).toStrictEqual(new Date("2021-01-01"));
        expect(parameters.props("forecastEnd")).toStrictEqual(new Date("2021-06-01"));
        expect(parameters.props("countries")).toStrictEqual([
            {
                code: "GBR",
                name: "United Kingdom",
                public: true,
                population: 1000000.09
            }]);
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

    it("does not render Charts when fetching results", () => {
        const store = new Vuex.Store<RootState>({
            state: mockRootState({
                fetchingResults: true
            })
        });
        const wrapper = shallowMount(Home, { store });
        const charts = wrapper.findComponent(Charts);
        expect(charts.exists()).toBe(false);
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

    it("dispatches updateCountry on update emitted from Parameters", () => {
        const mockUpdateCountry = jest.fn();
        const store = new Vuex.Store<RootState>({
            state: mockRootState({
                metadata: {} as any
            }),
            actions: {
                updateCountry: mockUpdateCountry
            }
        });

        const wrapper = shallowMount(Home, { store });
        wrapper.findComponent(Parameters).vm.$emit("updateCountry", "FRA");
        expect(mockUpdateCountry.mock.calls.length).toBe(1);
        expect(mockUpdateCountry.mock.calls[0][1]).toBe("FRA");
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

    it("renders and dismissed errors", async () => {
        const mockSetErrors = jest.fn();
        const store = new Vuex.Store<RootState>({
            state: mockRootState({
                errors: [{ error: "an error" }]
            }),
            mutations: {
                setErrors: mockSetErrors
            }
        });
        const wrapper = shallowMount(Home, { store });
        const errors = wrapper.findComponent(Errors);
        expect(errors.props("errors")).toBe(store.state.errors);

        errors.vm.$emit("dismissed");
        await Vue.nextTick();
        expect(mockSetErrors.mock.calls.length).toBe(1);
        expect(mockSetErrors.mock.calls[0][1]).toStrictEqual([]);
    });
});
