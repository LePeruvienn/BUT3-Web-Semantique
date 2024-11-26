# BUT3 Projet Web Sémantique

## Notre Question

Après avoir receuilli des donnés depuis le site internet [ourworldindata](https://ourworldindata.org/natural-disasters) sur les différentes catastrophes naturelles nous nous somme poser une grandre question centrale :

- **Quelles sont les impact des désastre sur les pays dans le monde ?** 

Grace à cette grande questions nous pourrons, répondre notamment à plusieurs question secondaires, comme par exemple :

- *Quelles sont les pays les plus affecter par ces désastre*


## L'ontologie

Pour commencer nous allons définir les différentes classes et propriétées

**Classes**
- `Disaster` (Désastre)
    - *Sous-classes*
        - `NaturalDisaster` (Désastre Nautrelle)
        - `TechnologicalDisaster` (Désastre Technologique)
    - *Propriétées*
        - `code` (Code unique du désastre)
        - `type`
        - ``

- `Location` (Lieu d'une catastrophe)
- `Impact` (Impacte d'un catastrophe)
- `Date` (Période du désastre)

- **Propriétées**
    - `hasType` (Type de désastre)
    - `hasImpact` (Impact du désastre)
    - `occuredIn` (Location ou c'est dérouler le désastre)
    - `startedOn`,`endedOn` (Date de début et de fin)
    - `totalDeath`
    - `hasWDT` (URI de l'identité Wikidata Associé)


