import { shallowMount } from "@vue/test-utils";
import Vue from "vue";
import Parameters from "@/components/parameters/Parameters.vue";
import { DynamicForm } from "@reside-ic/vue-dynamic-form";
import EditParameters from "@/components/parameters/EditParameters.vue";

describe("Parameters", () => {
    const paramGroupMetadata = [
      {
        id: "pg1",
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
        type: "rt"
      },
      {
        id: "pg3",
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

    function getWrapper() {
        return shallowMount(Parameters, { propsData: { paramGroupMetadata, paramValues } });
    }

    it("renders dynamicForm parameter groups with collapsed control sections", () => {
        const wrapper = getWrapper();
        const dynForms = wrapper.findAllComponents(DynamicForm);
        expect(dynForms.length).toBe(2);
        expect(dynForms.at(0).props("readonly")).toStrictEqual(true);
        expect(dynForms.at(0).props("formMeta")).toStrictEqual({
            controlSections: [
                {
                    label: "cs1.1",
                    control: {
                      value: "old1"
                    },
                    collapsible: true,
                    collapsed: true
                },
                { label: "cs1.2", collapsible: true, collapsed: true }
            ]
        });
        expect(dynForms.at(1).props("readonly")).toStrictEqual(true);
        expect(dynForms.at(1).props("formMeta")).toStrictEqual({
            controlSections: [
                { label: "cs2.1", collapsible: true, collapsed: true }
            ]
        });
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

        expect(wrapper.emitted("updateMetadata")!!.length).toBe(1);
        expect(wrapper.emitted("updateMetadata")!![0][0]).toStrictEqual( [
            newParamGroup,
            paramGroupMetadata[1],
            paramGroupMetadata[2]
        ]);

        expect(wrapper.emitted("updateValues")!!.length).toBe(1);
        expect(wrapper.emitted("updateValues")!![0][0]).toStrictEqual( {
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
