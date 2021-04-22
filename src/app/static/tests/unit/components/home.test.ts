import { createStore } from "vuex";
import {mockRootState} from "../../mocks";
import {shallowMount} from "@vue/test-utils";
import Home from "@/views/Home.vue";

describe("Home", () => {
  it("gets metadata on mount", () => {
      const mockGetMetadata = jest.fn();
      const $store = createStore({
          state: mockRootState(),
          actions: {
              getMetadata: mockGetMetadata
          }
      });

      shallowMount(Home, {
          global: { mocks: { $store } }
      });

      expect(mockGetMetadata.mock.calls.length).toBe(1);
  });
});
