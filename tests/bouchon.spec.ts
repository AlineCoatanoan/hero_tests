//Un “bouchon” (ou stub en anglais) est une technique utilisée en dév et en tests pour simuler une réponse d’API ou 
// un service externe sans avoir à faire réellement l’appel réseau.

//Autrement dit, au lieu de demander la vraie donnée au serveur 
//(qui peut être aléatoire ou dépendre de l’état du jeu), 
//on “bouchonne” la réponse avec des données fixes et contrôlées. 
//Ça permet de tester l'interface ou le code de manière fiable et répétable.

import { test, expect } from "@playwright/test";
import { loginFunction } from "./utils/login.js";

test("quetes aléatoires", async ({ page }) => {
    await loginFunction(page);
    await page.getByRole('link', { name: 'Crée ton équipe !' }).click();
    await expect(page).toHaveURL("http://localhost:8080/new-team");

    //recruter 4 héros
    const recrutButtons = page.getByRole('button', { name: /^Recruter\s+/ });
    for (let i = 0; i < 4; i++) {
    await recrutButtons.nth(i).click();
    }
    await page.getByRole('button', { name: 'Créer le groupe' }).click();

  

    await page.route("http://localhost:8080/api/quetes/*/_commencer", async (route) => {
        await route.fulfill({
            status: 200,
            json: {
                morts: [],
                name: "La quête du Graal",
                gain: 500
            }
        });
    });

      await page.getByRole('button', { name: 'Commencer' }).first().click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText("La quête du Graal")).toBeVisible();
    await expect(dialog.getByText("500")).toBeVisible();

});