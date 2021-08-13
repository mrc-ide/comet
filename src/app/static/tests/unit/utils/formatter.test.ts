import { numericFormatter } from "@/utils/formatter";

describe("formatter", () => {
    it("can format to numeral string and suffix million abbreviation", () => {
        const result = numericFormatter(2000000);
        expect(result).toBe("2.00m");
    });

    it("can format to numeral string and suffix thousand abbreviation", () => {
        const result = numericFormatter(99900);
        expect(result).toBe("99.90k");
    });

    it("can format to numeral string and suffix hundred abbreviation", () => {
        const result = numericFormatter(100);
        expect(result).toBe("100");
    });

    it("can format to numeral string and suffix billion abbreviation", () => {
        const result = numericFormatter(3000000000);
        expect(result).toBe("3.00b");
    });
});
