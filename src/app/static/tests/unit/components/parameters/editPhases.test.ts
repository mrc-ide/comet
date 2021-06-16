import EditPhases from "@/components/parameters/EditPhases.vue";
import { mount, Wrapper } from "@vue/test-utils";
import Modal from "@/components/Modal.vue";
import Vue from "vue";

describe("EditPhases", () => {
    const forecastStart = new Date("2021-01-01");
    const forecastEnd = new Date("2021-01-10");
    const paramGroup = {
        id: "phases",
        label: "Social restrictions",
        type: "rt",
        config: [
            { start: "2021-01-02", value: 0.9 },
            { start: "2021-01-05", value: 1.5 }
        ]
    };

    function getWrapper(open = true) {
        const propsData = {
            open,
            forecastStart,
            forecastEnd,
            paramGroup
        };
        return mount(EditPhases, { propsData });
    }

    async function dragSlider(wrapper: Wrapper<Vue>, sliderIdx: number, dragAsPercent: number) {
        // set rail element mock width before mousemoves so offset calculations will work
        const railEl = wrapper.vm.$refs.rail as HTMLDivElement;
        jest.spyOn(railEl, "clientWidth", "get")
            .mockImplementation(() => 1000);

        const slider = wrapper.findAll(".slider").at(sliderIdx);

        slider.trigger("mousedown", { offsetX: 0 });
        await Vue.nextTick();

        slider.trigger("mousemove", { offsetX: dragAsPercent * 10 });
        await Vue.nextTick();

        slider.trigger("mouseup");
        await Vue.nextTick();
    }

    it("renders as expected", () => {
        const wrapper = getWrapper();
        const modal = wrapper.findComponent(Modal);
        expect(modal.find("h3").text()).toBe("Edit Social restrictions");

        const rail = modal.find(".phase-editor .phases-container .rail");

        const sliders = rail.findAll(".slider");
        expect(sliders.length).toBe(2);

        const slider1 = sliders.at(0);
        expect(slider1.attributes("role")).toBe("slider");
        expect(slider1.attributes("tabindex")).toBe("0");
        expect(slider1.element.style.left).toBe("10%");
        expect(slider1.element.style.zIndex).toBe("99");
        expect(slider1.attributes("class")).toBe("slider phase-odd");
        expect(slider1.attributes("aria-valuenow")).toBe("1");
        expect(slider1.attributes("aria-valuetext")).toBe("02/01/21");
        expect(slider1.attributes("aria-valuemin")).toBe("0");
        expect(slider1.attributes("aria-valuemax")).toBe("3");
        expect(slider1.attributes("aria-label")).toBe("Phase 1");

        expect(slider1.find(".slider-spike").attributes("class")).toBe("slider-spike phase-odd");
        expect(slider1.find(".phase-label").text()).toBe("Phase 1");
        expect(slider1.find(".phase-days").text()).toBe("(3 days)");
        expect(slider1.find(".phase-start").text()).toBe("Start: 02/01/21");
        expect(slider1.find(".phase-end").text()).toBe("End: 04/01/21");
        expect(slider1.find(".phase-rt").text()).toBe("Rt: 0.9");

        const slider2 = sliders.at(1);
        expect(slider2.attributes("role")).toBe("slider");
        expect(slider2.attributes("tabindex")).toBe("1");
        expect(slider2.element.style.left).toBe("40%");
        expect(slider2.element.style.zIndex).toBe("99");
        expect(slider2.attributes("class")).toBe("slider phase-even");
        expect(slider2.attributes("aria-valuenow")).toBe("4");
        expect(slider2.attributes("aria-valuetext")).toBe("05/01/21");
        expect(slider2.attributes("aria-valuemin")).toBe("2");
        expect(slider2.attributes("aria-valuemax")).toBe("9");
        expect(slider2.attributes("aria-label")).toBe("Phase 2");

        expect(slider2.find(".slider-spike").attributes("class")).toBe("slider-spike phase-even");
        expect(slider2.find(".phase-label").text()).toBe("Phase 2");
        expect(slider2.find(".phase-days").text()).toBe("(6 days)");
        expect(slider2.find(".phase-start").text()).toBe("Start: 05/01/21");
        expect(slider2.find(".phase-end").text()).toBe("End: 10/01/21");
        expect(slider2.find(".phase-rt").text()).toBe("Rt: 1.5");

        expect(modal.find("button.btn-action").text()).toBe("OK");
        expect(modal.find("button.btn-secondary").text()).toBe("Cancel");
    });

    it("dragging slider updates values", async () => {
        const wrapper = getWrapper();
        // drag second slider back from 05/01/21 to 03/01/21
        await dragSlider(wrapper, 1, -20);

        const sliders = wrapper.findAll(".slider");
        const slider1 = sliders.at(0);
        expect(slider1.element.style.left).toBe("10%");
        expect(slider1.attributes("aria-valuenow")).toBe("1");
        expect(slider1.attributes("aria-valuetext")).toBe("02/01/21");
        expect(slider1.attributes("aria-valuemin")).toBe("0");
        expect(slider1.attributes("aria-valuemax")).toBe("1");
        expect(slider1.attributes("aria-label")).toBe("Phase 1");
        expect(slider1.find(".phase-days").text()).toBe("(1 day)");
        expect(slider1.find(".phase-start").text()).toBe("Start: 02/01/21");
        expect(slider1.find(".phase-end").text()).toBe("End: 02/01/21");

        const slider2 = sliders.at(1);
        expect(slider2.element.style.left).toBe("20%");
        expect(slider2.attributes("aria-valuenow")).toBe("2");
        expect(slider2.attributes("aria-valuetext")).toBe("03/01/21");
        expect(slider2.attributes("aria-valuemin")).toBe("2");
        expect(slider2.attributes("aria-valuemax")).toBe("9");
        expect(slider2.attributes("aria-label")).toBe("Phase 2");
        expect(slider2.find(".phase-days").text()).toBe("(8 days)");
        expect(slider2.find(".phase-start").text()).toBe("Start: 03/01/21");
        expect(slider2.find(".phase-end").text()).toBe("End: 10/01/21");
    });

    it("pressing OK button emits event with updated phases", async () => {
        const wrapper = getWrapper();
        await dragSlider(wrapper, 0, 10);
        await dragSlider(wrapper, 1, 20);

        wrapper.find("button.btn-action").trigger("click");
        expect(wrapper.emitted("update")?.length).toBe(1);
        expect(wrapper.emitted("update")![0][0]).toStrictEqual([
            { start: "2021-01-03", value: 0.9 },
            { start: "2021-01-07", value: 1.5 }
        ]);
    });

    it("pressing Cancel button emits cancel event", () => {
        const wrapper = getWrapper();
        wrapper.find("button.btn-secondary").trigger("click");
        expect(wrapper.emitted("cancel")?.length).toBe(1);
    });

    it("mousedown brings slider to front", async () => {
        const wrapper = getWrapper();
        const sliders = wrapper.findAll(".slider");

        sliders.at(0).trigger("mousedown", { offsetX: 0 });
        await Vue.nextTick();
        expect(sliders.at(0).element.style.zIndex).toBe("100");
        expect(sliders.at(1).element.style.zIndex).toBe("99");

        sliders.at(1).trigger("mousedown", { offsetX: 0 });
        await Vue.nextTick();
        expect(sliders.at(0).element.style.zIndex).toBe("99");
        expect(sliders.at(1).element.style.zIndex).toBe("100");
    });

    it("slider value is limited by forecast start", async () => {
        const wrapper = getWrapper();
        await dragSlider(wrapper, 0, -100);

        const slider = wrapper.findAll(".slider").at(0);
        expect(slider.element.style.left).toBe("0%");
        expect(slider.attributes("aria-valuenow")).toBe("0");
        expect(slider.find(".phase-start").text()).toBe("Start: 01/01/21");
    });

    it("slider value is limited by forecast end", async () => {
        const wrapper = getWrapper();
        await dragSlider(wrapper, 1, 100);

        const slider = wrapper.findAll(".slider").at(1);
        expect(slider.element.style.left).toBe("90%");
        expect(slider.attributes("aria-valuenow")).toBe("9");
        expect(slider.find(".phase-start").text()).toBe("Start: 10/01/21");
    });

    it("slider value is limited by start of next phases", async () => {
        const wrapper = getWrapper();
        await dragSlider(wrapper, 0, 100);

        const slider = wrapper.findAll(".slider").at(0);
        expect(slider.element.style.left).toBe("30%");
        expect(slider.attributes("aria-valuenow")).toBe("3");
        expect(slider.find(".phase-start").text()).toBe("Start: 04/01/21");
    });

    it("slider values is limited by end of previous phase", async () => {
        const wrapper = getWrapper();
        await dragSlider(wrapper, 1, -100);

        const slider = wrapper.findAll(".slider").at(1);
        expect(slider.element.style.left).toBe("20%");
        expect(slider.attributes("aria-valuenow")).toBe("2");
        expect(slider.find(".phase-start").text()).toBe("Start: 03/01/21");
    });
});
