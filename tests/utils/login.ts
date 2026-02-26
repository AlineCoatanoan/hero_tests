import type { Page } from '@playwright/test';

export async function loginFunction(page: Page) {
    await page.request.delete("http://localhost:8080/api/_reset");

    await page.goto("http://localhost:8080/landing-page");

    await page.getByLabel("Choisissez un nom").fill("devquest");
    await page.getByRole("button", { name: "Commencer l'aventure !" }).click();
}