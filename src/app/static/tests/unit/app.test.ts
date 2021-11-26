import App from "@/App.vue";
import { shallowMount } from "@vue/test-utils";

describe("App", () => {
    it("renders as expected", () => {
        const wrapper = shallowMount(App);
        const routerLinks = wrapper.findAll(".nav-item router-link");
        expect(routerLinks.length).toBe(3);

        expect(routerLinks.at(0).text()).toBe("Home");
        expect(routerLinks.at(0).attributes("to")).toBe("/");
        expect(Object.keys(routerLinks.at(0).attributes())).toContain("exact");

        expect(routerLinks.at(1).text()).toBe("About");
        expect(routerLinks.at(1).attributes("to")).toBe("/about");

        expect(routerLinks.at(2).text()).toBe("Accessibility");
        expect(routerLinks.at(2).attributes("to")).toBe("/accessibility");
    });
});
