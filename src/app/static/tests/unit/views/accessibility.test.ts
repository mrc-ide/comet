import Accessibility from "@/views/Accessibility.vue";
import { shallowMount } from "@vue/test-utils";

describe("About", () => {
    it("renders as expected", () => {
        const wrapper = shallowMount(Accessibility);
        expect(wrapper.find("h1").text()).toBe("Accessibility");
        expect(wrapper.find("p").text())
            .toBe("This statement applies to content published on https://comet.dide.ic.ac.uk");
        expect(wrapper.find("#access-email a").attributes("href"))
            .toBe("mailto:reside@imperial.ac.uk");
    });
});
