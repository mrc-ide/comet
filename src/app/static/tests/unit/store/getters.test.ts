import { getters } from "@/store/getters";

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
});
