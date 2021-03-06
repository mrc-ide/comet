// Mock the import of plotly to avoid import failures in non-browser context
jest.mock("plotly.js", () => ({
    react: jest.fn()
}));
/* eslint-disable import/first */
import Charts from "@/components/charts/Charts.vue";
import Chart from "@/components/charts/Chart.vue";
import { shallowMount } from "@vue/test-utils";

describe("Charts", () => {
    it("renders Chart components with expected props", () => {
        const propsData = {
            chartMetadata: [
                { id: "chartMetadata1" } as any,
                { id: "chartMetadata2" } as any
            ],
            chartData: { value: "chartData" },
            layoutData: { value: "layoutData" }
        };
        const wrapper = shallowMount(Charts, { propsData });

        const charts = wrapper.findAllComponents(Chart);
        expect(charts.length).toBe(2);
        expect(charts.at(0).props("chartMetadata")).toStrictEqual({ id: "chartMetadata1" });
        expect(charts.at(0).props("layoutData")).toStrictEqual({ value: "layoutData" });
        expect(charts.at(0).props("chartData")).toStrictEqual({ value: "chartData" });

        expect(charts.at(1).props("chartMetadata")).toStrictEqual({ id: "chartMetadata2" });
        expect(charts.at(1).props("layoutData")).toStrictEqual({ value: "layoutData" });
        expect(charts.at(1).props("chartData")).toStrictEqual({ value: "chartData" });
    });

    it("renders no charts if no chartData", () => {
        const propsData = {
            chartMetadata: [
                { id: "chartMetadata1" } as any,
                { id: "chartMetadata2" } as any
            ],
            chartData: null,
            layoutData: { value: "layoutData" }
        };
        const wrapper = shallowMount(Charts, { propsData });

        const charts = wrapper.findAllComponents(Chart);
        expect(charts.length).toBe(0);
    });
});
