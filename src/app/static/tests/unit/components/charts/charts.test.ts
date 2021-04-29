// Mock the import of plotly to avoid import failures in non-browser context
jest.mock('plotly.js', () => ({
  react: jest.fn()
}));
import Charts from "@/components/charts/Charts.vue";
import Chart from "@/components/charts/Chart.vue";
import {shallowMount} from "@vue/test-utils";

describe("Charts", () => {
    it("renders Chart components with expected props", () => {
        const props = {
            chartMetadata: [
                {id: "chartMetadata1"} as any,
                {id: "chartMetadata2"} as any
            ],
            chartData: {value: "chartData"},
            layoutData: {value: "layoutData"}
        };
        const wrapper = shallowMount(Charts, {props});

        const charts = wrapper.findAllComponents(Chart);
        expect(charts.length).toBe(2);
        expect(charts[0].props("chartMetadata")).toStrictEqual({id: "chartMetadata1"});
        expect(charts[0].props("layoutData")).toStrictEqual({value: "layoutData"});
        expect(charts[0].props("chartData")).toStrictEqual({value: "chartData"});

        expect(charts[1].props("chartMetadata")).toStrictEqual({id: "chartMetadata2"});
        expect(charts[1].props("layoutData")).toStrictEqual({value: "layoutData"});
        expect(charts[1].props("chartData")).toStrictEqual({value: "chartData"});
    });

    it("renders no charts if no chartData", () => {
        const props = {
          chartMetadata: [
            {id: "chartMetadata1"} as any,
            {id: "chartMetadata2"} as any
          ],
          chartData: null,
          layoutData: {value: "layoutData"}
        };
        const wrapper = shallowMount(Charts, {props});

        const charts = wrapper.findAllComponents(Chart);
        expect(charts.length).toBe(0);
    });
});
