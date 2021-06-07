import { shallowMount } from "@vue/test-utils";
import Vue from "vue";
import Parameters from "@/components/parameters/Parameters.vue";
import { DynamicForm } from "@reside-ic/vue-dynamic-form";
import EditParameters from "@/components/parameters/EditParameters.vue";
import Collapsible from "@/components/Collapsible.vue";
import Phases from "@/components/parameters/Phases.vue";

describe("Parameters", () => {
    const paramGroupMetadata = [
        {
            id: "pg1",
            label: "Group 1",
            type: "dynamicForm",
            config: {
                controlSections: [
                    {
                        label: "cs1.1",
                        control: {
                            value: "old1"
                        }
                    },
                    {
                        label: "cs1.2"
                    }
                ]
            }
        },
        {
            id: "pg2",
            label: "Group 2",
            type: "rt",
            config: [
                { start: "2021-01-01", value: "1" }
            ]
        },
        {
            id: "pg3",
            label: "Group 3",
            type: "dynamicForm",
            config: {
                controlSections: [
                    {
                        label: "cs2.1"
                    }
                ]
            }
        }
    ] as any;

    const paramValues = {
        pg1: {
            value1: "old1",
            value2: "unchanged"
        },
        pg2: {
            value3: "val3"
        },
        pg3: {
            value4: "val4"
        }
    };

    const forecastStart = new Date("2021-01-01");
    const forecastEnd = new Date("2021-06-01");

    function getWrapper() {
        return shallowMount(Parameters, {
            propsData: {
                paramGroupMetadata,
                paramValues,
                forecastStart,
                forecastEnd
            }
        });
    }

    it("renders collapsible dynamicForm and phases parameter groups", () => {
        const wrapper = getWrapper();
        const collapsibles = wrapper.findAllComponents(Collapsible);
        expect(collapsibles.length).toBe(3);

        expect(collapsibles.at(0).props("initialOpen")).toBe(false);
        expect(collapsibles.at(0).props("heading")).toBe("Group 1");
        const form1 = collapsibles.at(0).findComponent(DynamicForm);
        expect(form1.props("readonly")).toStrictEqual(true);
        expect(form1.props("formMeta")).toStrictEqual(paramGroupMetadata[0].config);

        expect(collapsibles.at(1).props("initialOpen")).toBe(false);
        expect(collapsibles.at(1).props("heading")).toBe("Group 2");
        const phases = collapsibles.at(1).findComponent(Phases);
        expect(phases.props("forecastStart")).toBe(forecastStart);
        expect(phases.props("forecastEnd")).toBe(forecastEnd);
        expect(phases.props("phases")).toStrictEqual(paramGroupMetadata[1].config);

        expect(collapsibles.at(2).props("initialOpen")).toBe(false);
        expect(collapsibles.at(2).props("heading")).toBe("Group 3");
        const form2 = collapsibles.at(2).findComponent(DynamicForm);
        expect(form2.props("readonly")).toStrictEqual(true);
        expect(form2.props("formMeta")).toStrictEqual(paramGroupMetadata[2].config);
    });

    it("renders Edit buttons", () => {
        const wrapper = getWrapper();
        const buttons = wrapper.findAll("button");
        expect(buttons.length).toBe(2);
        expect(buttons.at(0).text()).toBe("Edit");
        expect(buttons.at(1).text()).toBe("Edit");
    });

    it("renders EditParameters component", () => {
        const wrapper = getWrapper();
        const editParams = wrapper.findComponent(EditParameters);
        expect(editParams.props("open")).toBe(false);
        expect(editParams.props("paramGroup")).toBe(undefined);
    });

    it("clicking Edit button opens EditParameters", async () => {
        const wrapper = getWrapper();
        wrapper.findAll("button").at(0).trigger("click");
        await Vue.nextTick();
        const editParams = wrapper.findComponent(EditParameters);
        expect(editParams.props("open")).toBe(true);
        expect(editParams.props("paramGroup")).toBe(paramGroupMetadata[0]);
    });

    it("cancelling from EditParameters closes modal", async () => {
        const wrapper = getWrapper();
        wrapper.findAll("button").at(0).trigger("click");
        await Vue.nextTick();

        const editParams = wrapper.findComponent(EditParameters);
        editParams.vm.$emit("cancel");
        await Vue.nextTick();
        expect(editParams.props("open")).toBe(false);
        expect(editParams.props("paramGroup")).toBe(undefined);
    });

    it("updating from EditParameters closes modal, emits updates", async () => {
        const wrapper = getWrapper();
        wrapper.findAll("button").at(0).trigger("click");
        await Vue.nextTick();

        const newParamGroup = {
            id: "pg1",
            type: "dynamicForm",
            config: {
                controlSections: [
                    {
                        label: "cs1.1",
                        control: {
                            value: "new1"
                        }
                    },
                    {
                        label: "cs1.2"
                    }
                ]
            }
        };

        const newParamValues = { value1: "new1" };

        const editParams = wrapper.findComponent(EditParameters);
        editParams.vm.$emit("update", newParamGroup, newParamValues);
        await Vue.nextTick();
        expect(editParams.props("open")).toBe(false);
        expect(editParams.props("paramGroup")).toBe(undefined);

        const updateMetadata = wrapper.emitted("updateMetadata")!;
        expect(updateMetadata.length).toBe(1);
        expect(updateMetadata[0][0]).toStrictEqual([
            newParamGroup,
            paramGroupMetadata[1],
            paramGroupMetadata[2]
        ]);

        const updateValues = wrapper.emitted("updateValues")!;
        expect(updateValues.length).toBe(1);
        expect(updateValues[0][0]).toStrictEqual({
            pg1: {
                value1: "new1",
                value2: "unchanged"
            },
            pg2: {
                value3: "val3"
            },
            pg3: {
                value4: "val4"
            }
        });
    });
});
