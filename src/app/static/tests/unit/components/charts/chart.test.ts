// Mock the import of plotly so that we can spy on its exported 'react' method - need to do this
// before importing Chart
jest.mock("plotly.js", () => ({
    react: jest.fn()
}));
/* eslint-disable import/first */
import * as plotly from "plotly.js";
import Vue from "vue";
import { ChartMetadata } from "@/types";
import { shallowMount } from "@vue/test-utils";
import Chart from "@/components/charts/Chart.vue";

const chartData = {
    xVals: [1, 2, 3],
    yVals: [4, 5, 6]
};

const layoutData = {
    topMargin: 0,
    responsive: true
};

const chartMetadata: ChartMetadata = {
    id: "test",
    data: `{
                "x": xVals,
                "y": yVals
            }`,
    layout: `{
                "margin": {
                    "t": topMargin,
                    "l": data.x[0]
                }
            }`,
    config: `{
                "responsive": responsive,
                "height": data.y[2]
            }`,
    inputSchema: {
        type: "object",
        properties: {
            xVals: {
                type: "array",
                items: {
                    type: "number"
                }
            },
            yVals: {
                type: "array",
                items: {
                    type: "number"
                }
            },
            topMargin: { type: "number" },
            responsive: { type: "boolean" }
        },
        required: ["xVals", "yVals", "topMargin", "responsive"]
    }
};

describe("Chart", () => {
    const mockPlotlyReact = jest.spyOn(plotly, "react");

    beforeEach(() => {
        jest.clearAllMocks();
    });

   /* it("invokes Plotly on render with expected parameters", () => {
        const propsData = { chartMetadata, chartData, layoutData };
        shallowMount(Chart, { propsData });

        expect(mockPlotlyReact.mock.calls.length).toBe(1);
        const plotlyParams = mockPlotlyReact.mock.calls[0];
        expect(plotlyParams[0].constructor.name).toBe("HTMLDivElement");
        expect(plotlyParams[1]).toStrictEqual({
            x: [1, 2, 3],
            y: [4, 5, 6]
        });
        expect(plotlyParams[2]).toStrictEqual({
            margin: {
                t: 0,
                l: 1
            }
        });
        expect(plotlyParams[3]).toStrictEqual({
            responsive: true,
            height: 6
        });
    });

    it("invokes plotly again on data change", async () => {
        const propsData = { chartMetadata, chartData, layoutData };
        const wrapper = shallowMount(Chart, { propsData });

        wrapper.setProps({
            chartData: {
                xVals: [10, 20, 30],
                yVals: [40, 50, 60]
            }
        });
        await Vue.nextTick();

        expect(mockPlotlyReact.mock.calls.length).toBe(2);
        const plotlyParams = mockPlotlyReact.mock.calls[1];
        expect(plotlyParams[0].constructor.name).toBe("HTMLDivElement");
        expect(plotlyParams[1]).toStrictEqual({
            x: [10, 20, 30],
            y: [40, 50, 60]
        });
        expect(plotlyParams[2]).toStrictEqual({
            margin: {
                t: 0,
                l: 10
            }
        });
        expect(plotlyParams[3]).toStrictEqual({
            responsive: true,
            height: 60
        });
    });

    it("invokes plotly again on layout change", async () => {
        const propsData = { chartMetadata, chartData, layoutData };
        const wrapper = shallowMount(Chart, { propsData });

        wrapper.setProps({
            layoutData: {
                topMargin: 15,
                responsive: false
            }
        });
        await Vue.nextTick();

        expect(mockPlotlyReact.mock.calls.length).toBe(2);
        const plotlyParams = mockPlotlyReact.mock.calls[1];
        expect(plotlyParams[0].constructor.name).toBe("HTMLDivElement");
        expect(plotlyParams[1]).toStrictEqual({
            x: [1, 2, 3],
            y: [4, 5, 6]
        });
        expect(plotlyParams[2]).toStrictEqual({
            margin: {
                t: 15,
                l: 1
            }
        });
        expect(plotlyParams[3]).toStrictEqual({
            responsive: false,
            height: 6
        });
    });

    it("throws error if input data fails schema validation", () => {
        const badData = { zVals: [0, 1, 2] };
        const propsData = { chartMetadata, chartData: badData, layoutData };
        expect(() => shallowMount(Chart, { propsData })).toThrowError("Data validation failed");
    });*/
});
