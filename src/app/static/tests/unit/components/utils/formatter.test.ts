import { numericFormatter } from "@/utils/formatter";

describe("formatter", () => {
    it("can append million suffix", () => {
        const result = numericFormatter(2000000);
        expect(result).toBe("2.00m");
    });

    it("can append thousand suffix", () => {
        const result = numericFormatter(99900);
        expect(result).toBe("99.90k");
    });

    it("can append hundred suffix", () => {
        const result = numericFormatter(100);
        expect(result).toBe("100");
    });

    it("can append billion suffix", () => {
        const result = numericFormatter(3000000000);
        expect(result).toBe("3.00b");
    });
});
