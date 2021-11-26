// Importing the router causes import of Chart, hence need to mock plotly
/* eslint-disable import/first */
jest.mock("plotly.js", () => ({
    react: jest.fn()
}));
import router from "@/router/index";

describe("router", () => {
    it("defines expected routes", () => {
        const routes = router.getRoutes();
        expect(routes.length).toBe(3);
        expect(routes[0].name).toBe("Home");
        expect(routes[0].path).toBe("");
        expect(routes[0].components.default.name).toBe("Home");

        expect(routes[1].name).toBe("About");
        expect(routes[1].path).toBe("/about");
        expect(typeof routes[1].components.default).toBe("function");

        expect(routes[2].name).toBe("Accessibility");
        expect(routes[2].path).toBe("/accessibility");
        expect(typeof routes[1].components.default).toBe("function");
    });
});
