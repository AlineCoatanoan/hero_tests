import { test, expect } from "@playwright/test";
import { data } from "../data/data.js";

test.beforeEach(async ({ page }) => {
    await fetch("http://localhost:8080/api/_reset", { method: "DELETE" });

    await page.goto("http://localhost:8080/landing-page");

    const headerLocator = page.getByRole("heading", {
        name : "Bienvenue aventurier !",
    });

    await expect(headerLocator).toBeVisible();

    await page.getByLabel("Choisissez un nom").fill("devquest");
        const buttonValidate = page.getByRole("button", {
            name : "Commencer l'aventure !",
        });
    await expect(buttonValidate).toBeVisible();
    await buttonValidate.click();

    await expect(page).toHaveURL("http://localhost:8080/");
    await expect(page.getByRole("heading", { name : "Hero manager" })).toBeVisible();
});


test("créer une équipe et recruter un héros", async ({ page }) => {

    //créer ton équipe
    await page.getByRole('link', { name: 'Crée ton équipe !' }).click();

    //recruter 4 héros
    const recrutButtons = page.getByRole('button', { name: /^Recruter\s+/ });
    for (let i = 0; i < 4; i++) {
    await recrutButtons.nth(i).click();
    }

    //bouton recruter désactivé
    await expect(page.getByRole('button', { name: /^Recruter\s+/ })).toHaveCount(0);

    await page.getByRole('button', { name: 'Créer le groupe' }).click();
    const newMoney = page.getByTestId("money");
    await expect(newMoney).toHaveText("6000");

    //Reroll
    const oldMoney = Number(await newMoney.textContent());
    await page.getByRole('button', { name: "Reroll" }).click();
    await expect(newMoney).toHaveText((oldMoney - 1000).toString());

    //quêtes aléatoires
    const quests = page.locator("ul > li");
    const count = await quests.count(); //Compter combien il y a de quêtes
    const oldQuests: string[] = []; //Préparer un tableau pour stocker l’ancien état

    //Boucle pour lire le texte des anciennes quêtes
    for (let i= 0; i < count; i++) {
        const oldQuestsElement = quests.nth(i).locator(".."); //quests.nth(i) : récupère le iᵉ <li>. locator("..") : remonte au parent (<ul>).
        const text = await oldQuestsElement.textContent();
        oldQuests.push(text ?? ""); //si text est null, on met une chaîne vide, sinon on stocke le texte.
    }

    await page.getByRole('button', { name: "Reroll" }).click();

    const newQuests: string[] = [];
    const newCount = await quests.count();
    for (let i= 0; i < newCount; i++) {
        const newQuestsElement = quests.nth(i).locator("..");
        const text = await newQuestsElement.textContent();
        newQuests.push(text ?? "");
    }

    expect(oldQuests).not.toEqual(newQuests);


});

test("composition de l'équipe", async ({ page }) => {
    await expect(page).toHaveURL("http://localhost:8080/");
    
    // Créer une équipe incomplète (1 héros)
    await page.getByRole('link', { name: 'Crée ton équipe !' }).click();
    const recrutButtons = page.getByRole('button', { name: /^Recruter\s+/ });
    await recrutButtons.nth(0).click();
    await page.getByRole('button', { name: 'Créer le groupe' }).click();
    
    const team = page.locator("ul > li");
    const count = await team.count();
    const CompleteTeam = page.getByRole('link', { name: "Compléter l'équipe" });

    if (count < 4) {
    await expect(CompleteTeam).toBeVisible();
    } else {
    await expect(CompleteTeam).not.toBeVisible();
    }
});    


