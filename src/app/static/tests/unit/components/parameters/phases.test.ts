import { shallowMount } from "@vue/test-utils";
import Phases from "@/components/parameters/Phases.vue";
import Vue from "vue";

describe("Phases", () => {
    it("renders as expected when first phase starts on forecastStart", () => {
        const phases = [
            { start: "2021-01-01", value: 2 },
            { start: "2021-01-03", value: 8 }
        ];
        const wrapper = shallowMount(Phases, {
            propsData: {
                phases,
                forecastStart: new Date("2021-01-01"),
                forecastEnd: new Date("2021-01-10")
            }
        });

        const phaseBlocks = wrapper.findAll(".phase-block-container .phase-block");
        expect(phaseBlocks.length).toBe(2);
        expect(phaseBlocks.at(0).attributes("class")).toBe("phase-block phase-odd");
        expect(phaseBlocks.at(0).element.style.height).toBe("25.00%");
        expect(phaseBlocks.at(0).element.style.width).toBe("20.00%");
        expect(phaseBlocks.at(0).element.style.left).toBe("0.00%");

        expect(phaseBlocks.at(1).attributes("class")).toBe("phase-block phase-even");
        expect(phaseBlocks.at(1).element.style.height).toBe("100.00%");
        expect(phaseBlocks.at(1).element.style.width).toBe("80.00%");
        expect(phaseBlocks.at(1).element.style.left).toBe("20.00%");

        const phaseDescs = wrapper.findAll(".phase-description");
        expect(phaseDescs.length).toBe(2);
        expect(phaseDescs.at(0).find(".phase-header").text()).toBe("Phase 1 (2 days)");
        expect(phaseDescs.at(0).find(".phase-dates").text()).toBe("01/01/21 - 02/01/21");
        expect(phaseDescs.at(0).find(".phase-rt").text()).toBe("Rt: 2");

        expect(phaseDescs.at(1).find(".phase-header").text()).toBe("Phase 2 (8 days)");
        expect(phaseDescs.at(1).find(".phase-dates").text()).toBe("03/01/21 - 10/01/21");
        expect(phaseDescs.at(1).find(".phase-rt").text()).toBe("Rt: 8");
    });

    it("renders as expected when first phase starts after forecastStart", () => {
        const phases = [
            { start: "2021-01-01", value: 1.5 },
            { start: "2021-01-03", value: 0.5 }
        ];

        const wrapper = shallowMount(Phases, {
            propsData: {
                phases,
                forecastStart: new Date("2020-12-31"),
                forecastEnd: new Date("2021-01-04")
            }
        });

        const phaseBlocks = wrapper.findAll(".phase-block-container .phase-block");
        expect(phaseBlocks.length).toBe(2);
        expect(phaseBlocks.at(0).element.style.height).toBe("100.00%");
        expect(phaseBlocks.at(0).element.style.width).toBe("40.00%");
        expect(phaseBlocks.at(0).element.style.left).toBe("20.00%");

        expect(phaseBlocks.at(1).element.style.height).toBe("33.33%");
        expect(phaseBlocks.at(1).element.style.width).toBe("40.00%");
        expect(phaseBlocks.at(1).element.style.left).toBe("60.00%");

        const phaseDescs = wrapper.findAll(".phase-description");
        expect(phaseDescs.length).toBe(2);
        expect(phaseDescs.at(0).find(".phase-header").text()).toBe("Phase 1 (2 days)");
        expect(phaseDescs.at(0).find(".phase-dates").text()).toBe("01/01/21 - 02/01/21");
        expect(phaseDescs.at(0).find(".phase-rt").text()).toBe("Rt: 1.5");

        expect(phaseDescs.at(1).find(".phase-header").text()).toBe("Phase 2 (2 days)");
        expect(phaseDescs.at(1).find(".phase-dates").text()).toBe("03/01/21 - 04/01/21");
        expect(phaseDescs.at(1).find(".phase-rt").text()).toBe("Rt: 0.5");
    });

    it("can update when props change", async () => {
        const phases = [
          { start: "2021-01-01", value: 1.5 },
          { start: "2021-01-03", value: 0.5 }
        ];
        const forecastStart = new Date("2020-12-31");
        const forecastEnd = new Date("2021-01-10");

        const wrapper = shallowMount(Phases, {
          propsData: {
            phases,
            forecastStart,
            forecastEnd
          }
        });

        wrapper.setProps({
            phases: [
              ...phases,
              { start: "2021-01-07", value: 2.1 }
            ]
        });
        await Vue.nextTick();

        const phaseBlocks = wrapper.findAll(".phase-block-container .phase-block");
        expect(phaseBlocks.length).toBe(3);

        const phaseDescs = wrapper.findAll(".phase-description");
        expect(phaseDescs.length).toBe(3);
        expect(phaseDescs.at(2).find(".phase-header").text()).toBe("Phase 3 (4 days)");
        expect(phaseDescs.at(2).find(".phase-dates").text()).toBe("07/01/21 - 10/01/21");
        expect(phaseDescs.at(2).find(".phase-rt").text()).toBe("Rt: 2.1");
    });
});
