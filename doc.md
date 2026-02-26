## Qu’est-ce qu’un Locator ?

Un Locator est un objet qui représente un ou plusieurs éléments du DOM.

Il ne fait rien tout seul.
Il sert à :

- cibler des éléments
- interagir avec eux
- lire leur état

Exemple
```const button = page.getByRole('button', { name: 'Reroll' });```

Ici :

- button est un Locator
- ce n’est PAS encore le bouton
- c’est une référence dynamique vers lui

## Qu’est-ce que expect ?

expect sert à faire une assertion.

Il vérifie qu’une condition est vraie.

Si la condition est fausse → le test échoue.

Exemple
```await expect(button).toBeVisible();```

Ici :
- expect reçoit un Locator
- et vérifie qu’il est visible