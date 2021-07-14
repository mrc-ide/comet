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

    function setRailWidth(wrapper: Wrapper<Vue>) {
        const railEl = wrapper.vm.$refs.rail as HTMLDivElement;
        jest.spyOn(railEl, "clientWidth", "get")
            .mockImplementation(() => 1000);
    }

    async function dragSlider(wrapper: Wrapper<Vue>, sliderIdx: number, dragAsPercent: number) {
        // set rail element mock width before mousemoves so offset calculations will work
        setRailWidth(wrapper);

        const slider = wrapper.findAll(".slider").at(sliderIdx);

        slider.trigger("mousedown", { offsetX: 0 });
        await Vue.nextTick();

        slider.trigger("mousemove", { offsetX: dragAsPercent * 10 });
        await Vue.nextTick();

        slider.trigger("mouseup");
        await Vue.nextTick();
    }

    async function inputRtValue(wrapper: Wrapper<Vue>, index: number, value: string) {
        const input = wrapper.find(`#phase-rt-${index}`);
        input.setValue(value);
        input.trigger("change");
        await Vue.nextTick();
    }

    it("renders as expected", () => {
        const wrapper = getWrapper();
        const modal = wrapper.findComponent(Modal);
        expect(modal.find("h3").text()).toBe("Edit Social restrictions");
        expect(modal.find(".mb-3").text()).toContain(
            "Click on a Phase to drag it to a new start date. Click on timeline to add a new Phase."
        );
        expect(modal.find("#rt-range-text").text()).toBe("Rt values must be between 0.01 and 4.");

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
        expect(slider1.find(".phase-dates").classes()).toContain("disable-select");
        expect(slider1.find(".phase-label").text()).toBe("Phase 1");
        expect(slider1.find(".phase-days").text()).toBe("(3 days)");
        expect(slider1.find(".phase-start").text()).toBe("Start: 02/01/21");
        expect(slider1.find(".phase-end").text()).toBe("End: 04/01/21");
        expect(slider1.find(".phase-rt").text()).toBe("Rt:");
        const rtInput1 = slider1.find("input");
        expect(rtInput1.attributes("id")).toBe("phase-rt-0");
        expect(rtInput1.attributes("type")).toBe("number");
        expect(rtInput1.attributes("min")).toBe("0.01");
        expect(rtInput1.attributes("max")).toBe("4");
        expect(rtInput1.attributes("step")).toBe("0.01");
        expect((rtInput1.element as HTMLInputElement).value).toBe("0.9");

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
        expect(slider2.find(".phase-dates").classes()).toContain("disable-select");
        expect(slider2.find(".phase-label").text()).toBe("Phase 2");
        expect(slider2.find(".phase-days").text()).toBe("(6 days)");
        expect(slider2.find(".phase-start").text()).toBe("Start: 05/01/21");
        expect(slider2.find(".phase-end").text()).toBe("End: 10/01/21");
        expect(slider2.find(".phase-rt").text()).toBe("Rt:");
        const rtInput2 = slider2.find("input");
        expect(rtInput2.attributes("id")).toBe("phase-rt-1");
        expect(rtInput2.attributes("type")).toBe("number");
        expect(rtInput2.attributes("min")).toBe("0.01");
        expect(rtInput2.attributes("max")).toBe("4");
        expect(rtInput2.attributes("step")).toBe("0.01");
        expect((rtInput2.element as HTMLInputElement).value).toBe("1.5");

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

        wrapper.find("#phase-rt-0").setValue("1.9");
        wrapper.find("#phase-rt-0").trigger("change");
        wrapper.find("#phase-rt-1").setValue("3.99");
        await inputRtValue(wrapper, 0, "1.9");
        await inputRtValue(wrapper, 1, "3.99");

        wrapper.find("button.btn-action").trigger("click");
        expect(wrapper.emitted("update")?.length).toBe(1);
        expect(wrapper.emitted("update")![0][0]).toStrictEqual([
            { start: "2021-01-03", value: 1.9 },
            { start: "2021-01-07", value: 3.99 }
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

    it("click on input brings slider to front", async () => {
        const wrapper = getWrapper();
        const sliders = wrapper.findAll(".slider");

        await sliders.at(0).trigger("mousedown", { offsetX: 0 });

        await sliders.at(1).find("input").trigger("click", { offsetX: 0 });
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

    it("can update Rt value", async () => {
        const wrapper = getWrapper();
        await inputRtValue(wrapper, 0, "2.53");

        expect((wrapper.find("#phase-rt-0").element as HTMLInputElement).value).toBe("2.53");
        expect(wrapper.vm.$data.sliderValues[0].rt).toBe(2.53);
    });

    it("trims excess decimal places when user enters Rt value", async () => {
        const wrapper = getWrapper();
        await inputRtValue(wrapper, 1, "1.3199");

        expect((wrapper.find("#phase-rt-1").element as HTMLInputElement).value).toBe("1.32");
        expect(wrapper.vm.$data.sliderValues[1].rt).toBe(1.32);
    });

    it("sets Rt value to min when user enters value less than min", async (done) => {
        const wrapper = getWrapper();
        await inputRtValue(wrapper, 0, "-0.1");

        expect((wrapper.find("#phase-rt-0").element as HTMLInputElement).value).toBe("0.01");
        expect(wrapper.vm.$data.sliderValues[0].rt).toBe(0.01);

        // shows validation animation
        const rtRangeText = wrapper.find("#rt-range-text");
        expect(rtRangeText.classes()).toStrictEqual(["d-inline-block", "animate__animated", "animate__headShake"]);
        const input1 = wrapper.findAll(".slider input").at(0);
        expect(input1.classes()).toStrictEqual(["phase-rt-input", "animate__animated", "animate__headShake"]);
        const input2 = wrapper.findAll(".slider input").at(1);
        expect(input2.classes()).toStrictEqual(["phase-rt-input"]);
        setTimeout(() => {
            expect(rtRangeText.classes()).toStrictEqual(["d-inline-block"]);
            expect(input1.classes()).toStrictEqual(["phase-rt-input"]);
            expect(input2.classes()).toStrictEqual(["phase-rt-input"]);
            done();
        }, 1100);
    });

    it("sets Rt value to max when user enters value greater than max", async (done) => {
        const wrapper = getWrapper();
        await inputRtValue(wrapper, 1, "5.5555");

        expect((wrapper.find("#phase-rt-1").element as HTMLInputElement).value).toBe("4");
        expect(wrapper.vm.$data.sliderValues[1].rt).toBe(4);

        // shows validation animation
        const rtRangeText = wrapper.find("#rt-range-text");
        expect(rtRangeText.classes()).toStrictEqual(["d-inline-block", "animate__animated", "animate__headShake"]);
        const input1 = wrapper.findAll(".slider input").at(0);
        expect(input1.classes()).toStrictEqual(["phase-rt-input"]);
        const input2 = wrapper.findAll(".slider input").at(1);
        expect(input2.classes()).toStrictEqual(["phase-rt-input", "animate__animated", "animate__headShake"]);
        setTimeout(() => {
            expect(rtRangeText.classes()).toStrictEqual(["d-inline-block"]);
            expect(input1.classes()).toStrictEqual(["phase-rt-input"]);
            expect(input2.classes()).toStrictEqual(["phase-rt-input"]);
            done();
        }, 1100);
    });

    it("Rt value defaults to 1 when user clears value", async () => {
        const wrapper = getWrapper();
        await inputRtValue(wrapper, 0, "");

        expect((wrapper.find("#phase-rt-0").element as HTMLInputElement).value).toBe("1");
        expect(wrapper.vm.$data.sliderValues[0].rt).toBe(1);
    });

    it("clicking on timeline adds a new first phase", async () => {
        const wrapper = getWrapper();
        setRailWidth(wrapper);
        await wrapper.find(".rail").trigger("click", { offsetX: 0 });

        const { sliderValues } = wrapper.vm.$data;
        expect(sliderValues.length).toBe(3);
        expect(sliderValues[0].daysFromStart).toBe(0);
        expect(sliderValues[0].rt).toBe(1);
        expect(sliderValues[0].zIndex).toBe(99);

        const sliders = wrapper.findAll(".slider");
        expect(sliders.length).toBe(3);
        const slider1 = sliders.at(0);
        expect(slider1.element.style.left).toBe("0%");
        expect(slider1.element.style.zIndex).toBe("99");
        expect(slider1.find(".phase-label").text()).toBe("Phase 1");
        expect(slider1.find(".phase-days").text()).toBe("(1 day)");
        expect(slider1.find(".phase-start").text()).toBe("Start: 01/01/21");
        expect(slider1.find(".phase-end").text()).toBe("End: 01/01/21");
        expect((slider1.find("input").element as HTMLInputElement).value).toBe("1");
        const slider2 = sliders.at(1);
        expect(slider2.element.style.left).toBe("10%");
        expect(slider2.element.style.zIndex).toBe("99");
        expect(slider2.find(".phase-label").text()).toBe("Phase 2");
        expect(slider2.find(".phase-days").text()).toBe("(3 days)");
        expect(slider2.find(".phase-start").text()).toBe("Start: 02/01/21");
        expect(slider2.find(".phase-end").text()).toBe("End: 04/01/21");
        expect((slider2.find("input").element as HTMLInputElement).value).toBe("0.9");
        const slider3 = sliders.at(2);
        expect(slider3.element.style.left).toBe("40%");
        expect(slider3.element.style.zIndex).toBe("99");
        expect(slider3.find(".phase-label").text()).toBe("Phase 3");
        expect(slider3.find(".phase-days").text()).toBe("(6 days)");
        expect(slider3.find(".phase-start").text()).toBe("Start: 05/01/21");
        expect(slider3.find(".phase-end").text()).toBe("End: 10/01/21");
        expect((slider3.find("input").element as HTMLInputElement).value).toBe("1.5");
    });

    it("clicking on timeline adds a new last phase", async () => {
        const wrapper = getWrapper();
        setRailWidth(wrapper);
        await wrapper.find(".rail").trigger("click", { offsetX: 600 });

        const { sliderValues } = wrapper.vm.$data;
        expect(sliderValues.length).toBe(3);
        expect(sliderValues[2].daysFromStart).toBe(6);
        expect(sliderValues[2].rt).toBe(1);
        expect(sliderValues[2].zIndex).toBe(99);

        const sliders = wrapper.findAll(".slider");
        expect(sliders.length).toBe(3);
        const slider1 = sliders.at(0);
        expect(slider1.element.style.left).toBe("10%");
        expect(slider1.element.style.zIndex).toBe("99");
        expect(slider1.find(".phase-label").text()).toBe("Phase 1");
        expect(slider1.find(".phase-days").text()).toBe("(3 days)");
        expect(slider1.find(".phase-start").text()).toBe("Start: 02/01/21");
        expect(slider1.find(".phase-end").text()).toBe("End: 04/01/21");
        expect((slider1.find("input").element as HTMLInputElement).value).toBe("0.9");
        const slider2 = sliders.at(1);
        expect(slider2.element.style.left).toBe("40%");
        expect(slider2.element.style.zIndex).toBe("99");
        expect(slider2.find(".phase-label").text()).toBe("Phase 2");
        expect(slider2.find(".phase-days").text()).toBe("(2 days)");
        expect(slider2.find(".phase-start").text()).toBe("Start: 05/01/21");
        expect(slider2.find(".phase-end").text()).toBe("End: 06/01/21");
        expect((slider2.find("input").element as HTMLInputElement).value).toBe("1.5");
        const slider3 = sliders.at(2);
        expect(slider3.element.style.left).toBe("60%");
        expect(slider3.element.style.zIndex).toBe("99");
        expect(slider3.find(".phase-label").text()).toBe("Phase 3");
        expect(slider3.find(".phase-days").text()).toBe("(4 days)");
        expect(slider3.find(".phase-start").text()).toBe("Start: 07/01/21");
        expect(slider3.find(".phase-end").text()).toBe("End: 10/01/21");
        expect((slider3.find("input").element as HTMLInputElement).value).toBe("1");
    });

    it("clicking on timeline adds a new intermediate phase", async () => {
        const wrapper = getWrapper();
        setRailWidth(wrapper);
        await wrapper.find(".rail").trigger("click", { offsetX: 200 });

        const { sliderValues } = wrapper.vm.$data;
        expect(sliderValues.length).toBe(3);
        expect(sliderValues[1].daysFromStart).toBe(2);
        expect(sliderValues[1].rt).toBe(1);
        expect(sliderValues[1].zIndex).toBe(99);

        const sliders = wrapper.findAll(".slider");
        expect(sliders.length).toBe(3);
        const slider1 = sliders.at(0);
        expect(slider1.element.style.left).toBe("10%");
        expect(slider1.element.style.zIndex).toBe("99");
        expect(slider1.find(".phase-label").text()).toBe("Phase 1");
        expect(slider1.find(".phase-days").text()).toBe("(1 day)");
        expect(slider1.find(".phase-start").text()).toBe("Start: 02/01/21");
        expect(slider1.find(".phase-end").text()).toBe("End: 02/01/21");
        expect((slider1.find("input").element as HTMLInputElement).value).toBe("0.9");
        const slider2 = sliders.at(1);
        expect(slider2.element.style.left).toBe("20%");
        expect(slider2.element.style.zIndex).toBe("99");
        expect(slider2.find(".phase-label").text()).toBe("Phase 2");
        expect(slider2.find(".phase-days").text()).toBe("(2 days)");
        expect(slider2.find(".phase-start").text()).toBe("Start: 03/01/21");
        expect(slider2.find(".phase-end").text()).toBe("End: 04/01/21");
        expect((slider2.find("input").element as HTMLInputElement).value).toBe("1");
        const slider3 = sliders.at(2);
        expect(slider3.element.style.left).toBe("40%");
        expect(slider3.element.style.zIndex).toBe("99");
        expect(slider3.find(".phase-label").text()).toBe("Phase 3");
        expect(slider3.find(".phase-days").text()).toBe("(6 days)");
        expect(slider3.find(".phase-start").text()).toBe("Start: 05/01/21");
        expect(slider3.find(".phase-end").text()).toBe("End: 10/01/21");
        expect((slider3.find("input").element as HTMLInputElement).value).toBe("1.5");
    });
});
