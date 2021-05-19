import { mount } from "@vue/test-utils";
import Vue from "vue";
import EditParameters from "@/components/parameters/EditParameters.vue";
import Modal from "@/components/Modal.vue";
import { DynamicForm } from "@reside-ic/vue-dynamic-form";

describe("EditParameters", () => {
    const paramGroup = {
        id: "healthcare",
        label: "Healthcare capacity",
        type: "dynamicForm",
        config: {
            controlSections: [
                {
                    controlGroups: [
                        {
                            label: "Total general beds",
                            controls: [
                                {
                                    name: "generalBeds",
                                    type: "number",
                                    value: 314210
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    };

    const modifiedParamGroup = {
        id: "healthcare",
        label: "Healthcare capacity",
        type: "dynamicForm",
        config: {
            controlSections: [
                {
                    controlGroups: [
                        {
                            label: "Total general beds",
                            controls: [
                                {
                                    name: "generalBeds",
                                    type: "number",
                                    value: 1000
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    };

    function getWrapper(open = true) {
        const propsData = { open, paramGroup };
        return mount(EditParameters, { propsData });
    }

    it("renders as expected", () => {
        let wrapper = getWrapper();
        expect(wrapper.find("h3").text()).toBe("Edit Healthcare capacity parameters");
        expect(wrapper.findComponent(DynamicForm).props("formMeta")).toBe(paramGroup.config);
        expect(wrapper.findComponent(Modal).props("open")).toBe(true);
        expect(wrapper.find(".btn-action").text()).toBe("OK");
        expect(wrapper.find(".btn-secondary").text()).toBe("Cancel");

        wrapper = getWrapper(false);
        expect(wrapper.findComponent(DynamicForm).exists()).toBe(false);
        expect(wrapper.findComponent(Modal).props("open")).toBe(false);
    });

    it("Emits cancel event when cancel button clicked", async () => {
        const wrapper = getWrapper();
        wrapper.find(".btn-secondary").trigger("click");
        await Vue.nextTick();
        expect(wrapper.emitted("cancel")!.length).toBe(1);
    });

    it("Emits cancel event when OK button clicked with no form changes", async () => {
        const wrapper = getWrapper();
        wrapper.setData({ valid: true });
        await Vue.nextTick();
        wrapper.find(".btn-action").trigger("click");
        await Vue.nextTick();
        expect(wrapper.emitted("cancel")!.length).toBe(1);
        expect(wrapper.emitted("update")).toBeUndefined();
    });

    it("Emits update event when OK button clicked after form change", async (done) => {
        const wrapper = getWrapper();
        const input = wrapper.find("input");
        input.setValue("1000");
        await Vue.nextTick();
        wrapper.find(".btn-action").trigger("click");
        setTimeout(() => {
            expect(wrapper.emitted("update")!.length).toBe(1);
            expect(wrapper.emitted("cancel")).toBeUndefined();

            const updatedParams = wrapper.emitted("update")![0];
            expect(updatedParams[0]).toStrictEqual(modifiedParamGroup);
            expect(updatedParams[1]).toStrictEqual({ generalBeds: 1000 });

            expect(wrapper.findComponent(DynamicForm).props("formMeta")).toBe(paramGroup.config);
            done();
        });
    });

    it("resets form data when cancel after form change", async () => {
        const wrapper = getWrapper();
        const input = wrapper.find("input");
        input.setValue("1000");
        await Vue.nextTick();
        expect(wrapper.findComponent(DynamicForm).props("formMeta")).toStrictEqual(modifiedParamGroup.config);

        wrapper.find(".btn-secondary").trigger("click");
        await Vue.nextTick();
        expect(wrapper.findComponent(DynamicForm).props("formMeta")).toBe(paramGroup.config);
    });

    it("updates OK button disabled in response to form validate", async () => {
        const wrapper = getWrapper();
        const ok = wrapper.find(".btn-action");
        expect(ok.attributes("disabled")).toBe("disabled");

        const form = wrapper.findComponent(DynamicForm);
        form.vm.$emit("validate", true);
        await Vue.nextTick();
        expect(ok.attributes("disabled")).toBeUndefined();

        form.vm.$emit("validate", false);
        await Vue.nextTick();
        expect(ok.attributes("disabled")).toBe("disabled");
    });
});
