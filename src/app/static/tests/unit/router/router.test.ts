// Importing the router causes import of Chart, hence need to mock plotly
/* eslint-disable import/first */
jest.mock("plotly.js", () => ({
    react: jest.fn()
}));
import router from "@/router/index";

describe("router", () => {
    const routes = router.getRoutes();

    it("defines expected routes", () => {
        expect(routes.length).toBe(3);
        expect(routes[0].name).toBe("Home");
        expect(routes[0].path).toBe("");

        expect(routes[1].name).toBe("About");
        expect(routes[1].path).toBe("/about");

        expect(routes[2].name).toBe("Accessibility");
        expect(routes[2].path).toBe("/accessibility");
    });

    it("Home route loads Home component", () => {
        expect(routes[0].components.default.name).toBe("Home");
    });

    it("About route loads About component", (done) => {
        // Component is lazy loaded so need to invoke the import
        const componentPromise = (routes[1].components.default as () => Promise<any>)();
        componentPromise.then(
            (component: any) => {
                expect(component.default.options.name).toBe("About");
                done();
            }
        );
    });

    it("Accessibility route loads Accessibility component", (done) => {
        // Component is lazy loaded so need to invoke the import
        const componentPromise = (routes[2].components.default as () => Promise<any>)();
        componentPromise.then(
            (component: any) => {
              expect(component.default.name).toBe("Accessibility");
              done();
            }
        );
    })
});
