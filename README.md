# BUT3 Projet Web Sémantique

## Notre Question

Après avoir receuilli des donnés depuis le site internet [ourworldindata](https://ourworldindata.org/natural-disasters) sur les différentes catastrophes naturelles nous nous somme poser une grandre question centrale :

- **Quelles sont les impact des désastre sur les pays dans le monde ?** 

Grace à cette grande questions nous pourrons, répondre notamment à plusieurs question secondaires, comme par exemple :

- *Quelles sont les pays les plus affecter par ces désastre*


## Ontologie

Voici les préfix utilisé pour cette ontologie

```turtle
@prefix iut: <https://cours.iut-orsay.fr/npbd/> .
@prefix dis: <https://cours.iut-orsay.fr/npbd/disaster/> .
@prefix cou: <https://cours.iut-orsay.fr/npbd/country/> .
@prefix reg: <https://cours.iut-orsay.fr/npbd/region/> .
@prefix loc: <https://cours.iut-orsay.fr/npbd/location/> .
@prefix imp: <https://cours.iut-orsay.fr/npbd/impact/> .
@prefix dat: <https://cours.iut-orsay.fr/npbd/date/> .
@prefix frm: <https://cours.iut-orsay.fr/npbd/forme/> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
@prefix geo: <http://www.opengis.net/ont/geosparql#>.
```

Définition des différentes classes et leurs propriétées

### `iut:Disaster` (Désastre)

Cette classe as pour but de modéliser une catastrophe qui c'est produit dans le monde

**Sous-classes**
- `iut:NaturalDisaster` (Désastre Nautrelle)
- `iut:TechnologicalDisaster` (Désastre Technologique)

**Propriétées**
- `iut:code` (Code unique du désastre)
- `iut:eventName` (Nom données à cette évenement)
- `iut:disasterGroup` (Groupe lié à cette catastrophe)
- `iut:disasterType` (Type de la catastrophe)
- `iut:occuredIn` (Lieu d'une catastrophe)
- `iut:hasImpact` (Impacte d'un catastrophe)
- `iut:eventDate` (Période du désastre)
- `iut:magnitude` (Magnitude de l'évenement)
- `iut:magnitudeScale` (Echelle de la magnitude)


### `iut:Location` (Lieu du désastre)

Lieu ou c'est dérouler la catastrophe

**Propriétées**
- `iut:adress` (Adresse exacte du lieu)
- `iut:isInCountry` (Pays dans lequel se trouve le lieu)
- `iut:latitude` (Latitude de la catastrophe)
- `iut:longitude` (longitude de la catastrophe)
- `geo:hasGeometry` (Forme GeoSPARQL de l'évenement)

### `iut:Impact` (Impact d'un évenement)

Impact que le désastre à eu sur le monde

**Sous-classes**
- `iut:HumanImpact` (Impact humain du désastre)
    - *Propriétées*
        - `iut:totalDeath` (Nombre total de personne morte)
        - `iut:noInjured` (Nombre de personne bléssés)
        - `iut:noAffected` (Nombre de personne affectées directement de ou indirectement)
        - `iut:noHomeless` (Nombre de personne à la rue du à la castrophe)
        - `iut:totalAffected` (Nombre total de personne affectées)

- `iut:EconomicImpact` (Impact économique du désastre)
    - *Propriétées*
        - `iut:totalDamage` (Dommages économique totaux)
        - `iut:reconstructionCost` (Coût estimé pour la reconstruction)

### `iut:Date` (Date d'un évement)

Date et duration d'un évenement

**Propriétées**

- `iut:startYear` (Année ou l'éveneent à débuté)
- `iut:startMonth` (Mois ou l'évenemnt à débuté)
- `iut:startDay` (Jour ou l'évenement à débuté)
- `iut:endYear` (Année ou l'éveneent à terminé)
- `iut:endMonth` (Mois ou l'évenemnt à terminé)
- `iut:endDay` (Jour ou l'évenement à terminé)

### `iut:Country` (Pays)

Pays ou s'est dérouler l'évenement

**Propriétées**

- `iut:code` (Code unique du pays)
- `iut:countryName` (Nom du pays)
- `iut:isInRegion` (Nom de la région dans lequel est le pays)

### `iut:Region` (Continent)

Région ou s'est dérouler l'évenement

**Propriétées**
- `iut:code` (Code unique de la région)
- `iut:RegionName` (Nom de la région)
