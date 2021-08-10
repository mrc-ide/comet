import { expect, test } from "@playwright/test";

test.describe("home page tests", () => {
    test("renders homepage", async ({ page }) => {
        await page.goto("/");
        const name = await page.innerText("a.navbar-brand");
        expect(name).toBe("comet");

    });
});
