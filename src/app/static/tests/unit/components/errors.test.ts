import {shallowMount} from "@vue/test-utils";
import Vue from "vue";
import Errors from "@/components/Errors.vue";
import {BAlert} from "bootstrap-vue";

describe("Errors", () => {
    it("renders as expected with one errors", () => {
        const propsData = {
          errors: [
            {error: "ERROR_1", detail: "first error"}
          ]
        };
        const wrapper = shallowMount(Errors, {propsData});
        const alert = wrapper.findComponent(BAlert);
        expect(alert.props("variant")).toBe("danger");
        expect(alert.props("show")).toBe(true);
        expect(alert.props("dismissible")).toBe(true);
        expect(alert.find("strong").text()).toBe("An error occurred:");

        const items = alert.findAll("li");
        expect(items.length).toBe(1);
        expect(items.at(0).text()).toBe("first error");
    });

    it("renders as expected with two errors", () => {
        const propsData = {
            errors: [
                { error: "ERROR_1", detail: "first error"},
                { error: "ERROR_2" }
            ]
        };
        const wrapper = shallowMount(Errors, {propsData});
        const alert = wrapper.findComponent(BAlert);
        expect(alert.props("variant")).toBe("danger");
        expect(alert.props("show")).toBe(true);
        expect(alert.props("dismissible")).toBe(true);
        expect(alert.find("strong").text()).toBe("Errors occurred:");

        const items = alert.findAll("li");
        expect(items.length).toBe(2);
        expect(items.at(0).text()).toBe("first error");
        expect(items.at(1).text()).toBe("ERROR_2");
    });

    it("renders no alert if errors is empty", () => {
        const propsData = { errors:[] };
        const wrapper = shallowMount(Errors, {propsData});
        const alert = wrapper.findComponent(BAlert);
        expect(alert.exists()).toBe(false);
    });

    it("emits dismissed event", async () => {
        const propsData = {
          errors: [
            {error: "ERROR_1", detail: "first error"}
          ]
        };
        const wrapper = shallowMount(Errors, {propsData});
        const alert = wrapper.findComponent(BAlert);
        alert.vm.$emit("dismissed");
        await Vue.nextTick();
        expect(wrapper.emitted("dismissed")!.length).toBe(1);
    });
});
