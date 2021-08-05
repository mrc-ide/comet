import { getters } from "@/store/getters";
import { mockRootState } from "../../mocks";

describe("getters", () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    it("forecastStart returns expected Date", () => {
        const forecastStart = getters.forecastStart();
        expect(forecastStart).toEqual(today);
    });

    it("forecastEnd returns expected Date", () => {
        const millisValue = today.valueOf() + (1000 * 60 * 60 * 24 * 730);
        const expected = new Date(millisValue);
        const forecastEnd = getters.forecastEnd();
        expect(forecastEnd).toEqual(expected);
    });

    it("population returns expected population format", () => {
        const mockCountries = [{
            code: "NARN", name: "Narnia", public: true, population: 1200300.034
        }];
        const state = mockRootState({ countries: mockCountries, paramValues: { region: "NARN" } });
        const population = getters.population(state);
        expect(population).toEqual("1.20m");
    });
});
