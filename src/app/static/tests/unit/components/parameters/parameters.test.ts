import { shallowMount } from "@vue/test-utils";
import Parameters from "@/components/parameters/Parameters.vue";
import { DynamicForm } from "@reside-ic/vue-dynamic-form";

describe("Parameters", () => {
    it("renders dynamicForm parameter groups with collapsed control sections", () => {
        const paramGroupMetadata = [
            {
                id: "pg1",
                type: "dynamicForm",
                config: {
                    controlSections: [
                        {
                            label: "cs1.1"
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

        const wrapper = shallowMount(Parameters, { propsData: { paramGroupMetadata } });
        const dynForms = wrapper.findAllComponents(DynamicForm);
        expect(dynForms.length).toBe(2);
        expect(dynForms.at(0).props("readonly")).toStrictEqual(true);
        expect(dynForms.at(0).props("formMeta")).toStrictEqual({
            controlSections: [
                { label: "cs1.1", collapsible: true, collapsed: true },
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
});
