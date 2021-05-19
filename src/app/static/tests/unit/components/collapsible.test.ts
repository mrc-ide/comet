import { shallowMount } from "@vue/test-utils";
import Vue from "vue";
import Collapsible from "@/components/Collapsible.vue";
import { ChevronDownIcon, ChevronUpIcon } from "vue-feather-icons";
import { BCollapse } from "bootstrap-vue";

describe("Collapsible", () => {
    function getWrapper(propsData = { initialOpen: true, heading: "Test Heading" }) {
        return shallowMount(Collapsible, {
            propsData,
            slots: { default: "<div id='content'>test content</div>" }
        });
    }

    it("renders as expected when open", () => {
        const wrapper = getWrapper();

        expect(wrapper.find("h3").text()).toBe("Test Heading");
        expect(wrapper.findComponent(ChevronUpIcon).exists()).toBe(true);
        expect(wrapper.findComponent(ChevronDownIcon).exists()).toBe(false);

        expect(wrapper.findComponent(BCollapse).props("visible")).toBe(true);
        expect(wrapper.findComponent(BCollapse).find("#content").text()).toBe("test content");
    });

    it("renders as expected when closed", () => {
        const wrapper = getWrapper({ initialOpen: false, heading: "Test Heading" });

        expect(wrapper.find("h3").text()).toBe("Test Heading");
        expect(wrapper.findComponent(ChevronUpIcon).exists()).toBe(false);
        expect(wrapper.findComponent(ChevronDownIcon).exists()).toBe(true);

        expect(wrapper.findComponent(BCollapse).props("visible")).toBe(false);
        expect(wrapper.findComponent(BCollapse).find("#content").text()).toBe("test content");
    });

    it("clicking heading toggles open", async () => {
        const wrapper = getWrapper();
        const heading = wrapper.find("h3");
        heading.trigger("click");

        await Vue.nextTick();
        expect(wrapper.findComponent(ChevronUpIcon).exists()).toBe(false);
        expect(wrapper.findComponent(ChevronDownIcon).exists()).toBe(true);
        expect(wrapper.findComponent(BCollapse).props("visible")).toBe(false);

        heading.trigger("click");

        await Vue.nextTick();
        expect(wrapper.findComponent(ChevronUpIcon).exists()).toBe(true);
        expect(wrapper.findComponent(ChevronDownIcon).exists()).toBe(false);
        expect(wrapper.findComponent(BCollapse).props("visible")).toBe(true);
    });
});
