import Vuex from "vuex";
import { RootState } from "@/store/state";
import { shallowMount } from "@vue/test-utils";
import Vue from "vue";
import About from "@/views/About.vue";
import Errors from "@/components/Errors.vue";
import { mockRootState } from "../../mocks";

describe("About", () => {
    it("renders heading and api info", () => {
        const heading = "new message";

        const store = new Vuex.Store({
            state: {
                apiInfo: {
                    name: "test",
                    version: {
                        nimue: "0.1",
                        cometr: "0.2"
                    }
                }
            },
            actions: {}
        });

        const wrapper = shallowMount(About, {
            propsData: { heading },
            store
        });
        expect(wrapper.find("h1").text()).toMatch(heading);
        expect(wrapper.find("#api-name").text()).toBe("API Name: test");
        const versions = wrapper.findAll(".api-version");
        expect(versions.length).toBe(2);
        expect(versions.at(0).text()).toBe("nimue: 0.1");
        expect(versions.at(1).text()).toBe("cometr: 0.2");
    });

    it("renders and dismisses errors", async () => {
        const mockSetErrors = jest.fn();
        const store = new Vuex.Store<RootState>({
            state: mockRootState({
                errors: [{ error: "an error" }]
            }),
            mutations: {
                setErrors: mockSetErrors
            }
        });
        const wrapper = shallowMount(About, { store });
        const errors = wrapper.findComponent(Errors);
        expect(errors.props("errors")).toBe(store.state.errors);

        errors.vm.$emit("dismissed");
        await Vue.nextTick();
        expect(mockSetErrors.mock.calls.length).toBe(1);
        expect(mockSetErrors.mock.calls[0][1]).toStrictEqual([]);
    });
});
