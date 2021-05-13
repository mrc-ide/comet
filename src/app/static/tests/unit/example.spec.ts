import { shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import About from "@/views/About.vue";

describe("About.vue", () => {
    it("renders props.msg when passed", () => {
        const heading = "new message";

        const store = new Vuex.Store({
            state: {
                apiInfo: { name: "test", version: {} }
            },
            actions: {}
        });

        const wrapper = shallowMount(About, {
            propsData: { heading },
            store
        });
        expect(wrapper.text()).toMatch(heading);
    });
});
