import Vuex from "vuex";
import {RootState} from "@/store/state";
import {mockRootState} from "../../mocks";
import {shallowMount} from "@vue/test-utils";
import Vue from "vue";
import About from "@/views/About.vue";
import Errors from "@/components/Errors.vue";

describe("About", () => {
    it("renders errors, and sets errors to empty when dismissed from Errors component",
      async () => {
          const mockSetErrors = jest.fn();
          const store = new Vuex.Store<RootState>({
            state: mockRootState({
              errors: [{error: "an error"}]
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
