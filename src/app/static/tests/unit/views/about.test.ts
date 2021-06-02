import Vuex from "vuex";
import { RootState } from "@/store/state";
import { shallowMount } from "@vue/test-utils";
import Vue from "vue";
import About from "@/views/About.vue";
import Errors from "@/components/Errors.vue";
import { mockRootState } from "../../mocks";

describe("About", () => {
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
