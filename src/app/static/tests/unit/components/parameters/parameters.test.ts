import { shallowMount } from "@vue/test-utils";
import Vue from "vue";
import Parameters from "@/components/parameters/Parameters.vue";
import { DynamicForm } from "@reside-ic/vue-dynamic-form";
import EditParameters from "@/components/parameters/EditParameters.vue";
import EditPhases from "@/components/parameters/EditPhases.vue";
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

    it("Edit components are not rendered before group is selected", () => {
        const wrapper = getWrapper();
        expect(wrapper.findComponent(EditParameters).exists()).toBe(false);
        expect(wrapper.findComponent(EditPhases).exists()).toBe(false);
    });

    it("clicking Edit button for dynamicForm group opens EditParameters", async () => {
        const wrapper = getWrapper();
        wrapper.findAll("button").at(0).trigger("click");
        await Vue.nextTick();
        const editParams = wrapper.findComponent(EditParameters);
        expect(editParams.props("open")).toBe(true);
        expect(editParams.props("paramGroup")).toBe(paramGroupMetadata[0]);
    });

    it("clicking Edit button for rt group opens EditPhases", async () => {
        const wrapper = getWrapper();
        wrapper.findAll("button").at(1).trigger("click");
        await Vue.nextTick();
        const editPhases = wrapper.findComponent(EditPhases);
        expect(editPhases.props("open")).toBe(true);
        expect(editPhases.props("paramGroup")).toBe(paramGroupMetadata[1]);
        expect(editPhases.props("forecastStart")).toBe(forecastStart);
        expect(editPhases.props("forecastEnd")).toBe(forecastEnd);
    });

    it("cancelling from EditParameters removes modal", async () => {
        const wrapper = getWrapper();
        wrapper.findAll("button").at(0).trigger("click");
        await Vue.nextTick();

        const editParams = wrapper.findComponent(EditParameters);
        editParams.vm.$emit("cancel");
        await Vue.nextTick();
        expect(editParams.exists()).toBe(false);
    });

    it("cancelling from EditPhases removes modal", async () => {
        const wrapper = getWrapper();
        wrapper.findAll("button").at(1).trigger("click");
        await Vue.nextTick();

        const editPhases = wrapper.findComponent(EditPhases);
        editPhases.vm.$emit("cancel");
        await Vue.nextTick();
        expect(editPhases.exists()).toBe(false);
    });

    it("updating from EditParameters removes modal, emits updates", async () => {
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
        expect(editParams.exists()).toBe(false);

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

    it("updating from EditPhases removes modal, emits updates", async () => {
        const wrapper = getWrapper();
        wrapper.findAll("button").at(1).trigger("click");
        await Vue.nextTick();

        const newPhases = [
            { start: "2021-02-01", value: "2" },
            { start: "2021-03-01", value: "3" }
        ];
        const editPhases = wrapper.findComponent(EditPhases);
        editPhases.vm.$emit("update", newPhases);
        await Vue.nextTick();
        expect(editPhases.exists()).toBe(false);

        expect(wrapper.emitted("updateMetadata")?.length).toBe(1);
        expect(wrapper.emitted("updateMetadata")!![0][0]).toStrictEqual([
            paramGroupMetadata[0],
            {
                id: "pg2",
                label: "Group 2",
                type: "rt",
                config: newPhases
            },
            paramGroupMetadata[2]
        ]);

        expect(wrapper.emitted("updateValues")?.length).toBe(1);
        expect(wrapper.emitted("updateValues")!![0][0]).toStrictEqual({
          pg1: {
              value1: "old1",
              value2: "unchanged"
          },
          pg2: newPhases,
          pg3: {
              value4: "val4"
          }
        });
    });
});
