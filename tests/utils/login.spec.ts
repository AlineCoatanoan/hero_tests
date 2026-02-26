import { test, expect } from "@playwright/test";
import { loginFunction } from "./login.js";

test("login", async ({ page }) => {
    await loginFunction(page);
    await expect(page).toHaveURL("http://localhost:8080/");
});