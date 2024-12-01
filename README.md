# BUT3 Projet Web Sémantique

## 1. Trouver une question intéressante à laquelle répondre.

Après avoir receuilli des donnés depuis le site internet [ourworldindata](https://ourworldindata.org/natural-disasters) sur les différentes catastrophes naturelles nous nous somme poser une grandre question centrale :

- **Quelles sont les impact des désastre sur les pays dans le monde ?** 

Grace à cette grande questions nous pourrons, répondre notamment à plusieurs question secondaires, comme par exemple :

- *Quelles sont les pays les plus affecter humainement par ces désastre ?*

- *Qu'est ce qui fait qu'un pays et plus touché par des désastre qu'un autres?*

- *Quelles sont les pays qui sont le plus touché par les désastres économoquement ?*


## 2. Créez une ontologie pour décrire le domaine.

Pour le projet nous avons utilisé le logicielle **Protégé** qui nous as permit de créer notre ontologie. Si vous souhaitez directement allez consulter les données, vous pouvez allez voir le fichier [ontologie.ttl](https://github.com/LePeruvienn/BUT3-Web-Semantique/blob/main/rdf/ontologie.ttl).

### Description des données

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
- `iut:population` (Nombre de personne vivant dans le pays)
- `iut:lifeExpectancy` (Espérance de vie dans le pays)
- `iut:area` (Taille de la surface du pays en km2)
- `iut:humanDevelopmentIndex` (Indice de développement humain du pays)
- `iut:gdp` (PIB du pays)

### `iut:Region` (Continent)

Région ou s'est dérouler l'évenement

**Propriétées**
- `iut:code` (Code unique de la région)
- `iut:RegionName` (Nom de la région)
- `iut:population` (Nombre de personne vivant dans la région)
- `iut:area` (Taille de la surface de la région en km2)

## 3. Convertissez l'ensemble de données tabulaires en RDF et téléchargez le fichier RDF dans GraphDB.

**Configuration des données**

Après avoir receuilli les données je les ai mit dans OntoRefine et commencer à le *RDF mapping*. Durant mon *RDF mapping*, j'ai du utilisé l'outil *GREL* de OntoRefine pour ajoutez des conditionnel à mes données, par exempe avec la classe `NaturalDisaster` et `TechnologicalDisaster`, mais aussi pour pouvoir convertir mes proritété `latitude` et `longitude` en point *GeoSPARQL*.

- *GREL* pour mettre le type du triplet en `NaturalDisaster` ou `TechnologicalDisaster` dépandant de son type de désastre.

```GREL
if(value == "Natural", "NaturalDisaster", if(value == "Technological", "TechnologicalDisaster", "iut:Disaster"))
```

- *GREL* pour convertir les propritété de `latitude` et `longitude` en point *GeoSPARQL*

```GREL
if(isNotNull(cells["Latitude"].value) && isNotNull(cells["Longitude"].value), "Point(" + cells["Latitude"].value + " " + cells["Longitude"].value + ")")
```

Vous pouvez consultez ma configuration du RDF mapping avec le fichier [mapping.json](https://github.com/LePeruvienn/BUT3-Web-Semantique/blob/main/rdf/mapping.json).


**Exportation des données**

Ensuite j'ai converti les données en RDF. Vous pouvez consultez les données dans le fichier [triples.ttl](https://github.com/LePeruvienn/BUT3-Web-Semantique/blob/main/rdf/triples.ttl).

J'ai ensuite alors importez mes données dans **GraphDB** et continuer la suite du projet ...


## 4. Utilisez SPARQL pour lier les entités au graphe de connaissances externe

### `CONSTRUCT`

Nous allons d'abord effectuer des requêtes *CONSTRUCT* pour observer les résulstats des requêtes sur notre graph

#### Lier les données des pays de wikidata à nos données locales

Listes des données récupérer par **WikiData** :
- `population` : Nombre de personne vivant dans le pays
- `lifeExpectancy` : Espérance de vie dans le pays
- `area` : Taille de la surface du pays en km2
- `humanDevelopmentIndex` : Indice de développement humain du pays
- `gdp` : PIB du pays

**Requête** :

```sparql
PREFIX iut: <https://cours.iut-orsay.fr/app/npbd/projet/apinel2/>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX wd: <http://www.wikidata.org/entity/>
PREFIX wdt: <http://www.wikidata.org/prop/direct/>

CONSTRUCT {
    ?country iut:population ?population ;
             iut:lifeExpectancy ?lifeExpectancy ;
             iut:area ?area ;
             iut:humanDevelopmentIndex ?idh ;
             iut:gdp ?gdp .
} WHERE {
    # Partie GraphDB
    {
        SELECT ?country ?alpha3Code WHERE {
            ?country rdf:type iut:Country ;
                     iut:code ?alpha3Code .
        }
    }

    # Partie Wikidata
    SERVICE <https://query.wikidata.org/sparql> {
        ?wikidataCountry wdt:P298 ?alpha3Code ;
             wdt:P1082 ?population ;
             wdt:P2250 ?lifeExpectancy ;
             wdt:P2046 ?area ;
             wdt:P1081 ?idh ;
             wdt:P8744/wdt:P2131 ?gdp .
    }
}
```

#### Lier les données des régions de wikidata à nos données locales

Listes des données récupérer par **WikiData** :
- `population` : Nombre de personne vivant dans le continent
- `area` : Taille de la surface du continent en km2

**Requête** :

```sparql
PREFIX iut: <https://cours.iut-orsay.fr/app/npbd/projet/apinel2/>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX wd: <http://www.wikidata.org/entity/>
PREFIX wdt: <http://www.wikidata.org/prop/direct/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

CONSTRUCT {
    ?region iut:population ?population ;
    		iut:area ?area .
} WHERE {
    # Partie GraphDB
    {
        SELECT ?region ?regionName WHERE {
            ?region rdf:type iut:Region ;
                    iut:regionName ?regionName .
        }
    }

    # Partie Wikidata
    SERVICE <https://query.wikidata.org/sparql> {
        ?continent wdt:P31 wd:Q5107 ;
                   rdfs:label ?continentLabel ;
                   wdt:P1082 ?population ;
        		   wdt:P2046 ?area .
        
    	FILTER(str(?regionName) = str(?continentLabel))
    }
}
```

### `INSERT`

Maintenant nous appliquont les changement à notre graph locale.

#### Insertion des données WikiData des pays

```sparql
PREFIX iut: <https://cours.iut-orsay.fr/app/npbd/projet/apinel2/>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX wd: <http://www.wikidata.org/entity/>
PREFIX wdt: <http://www.wikidata.org/prop/direct/>

INSERT {
    ?country iut:population ?population ;
             iut:lifeExpectancy ?lifeExpectancy ;
             iut:area ?area ;
             iut:humanDevelopmentIndex ?idh ;
             iut:gdp ?gdp .
} WHERE {
    # Partie GraphDB
    {
        SELECT ?country ?alpha3Code WHERE {
            ?country rdf:type iut:Country ;
                     iut:code ?alpha3Code .
        }
    }

    # Partie Wikidata
    SERVICE <https://query.wikidata.org/sparql> {
        ?wikidataCountry wdt:P298 ?alpha3Code ;
             wdt:P1082 ?population ;
             wdt:P2250 ?lifeExpectancy ;
             wdt:P2046 ?area ;
             wdt:P1081 ?idh ;
             wdt:P8744/wdt:P2131 ?gdp .
    }
}
```

#### Insertion des données WikiData des Continents

```sparql
PREFIX iut: <https://cours.iut-orsay.fr/app/npbd/projet/apinel2/>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX wd: <http://www.wikidata.org/entity/>
PREFIX wdt: <http://www.wikidata.org/prop/direct/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

INSERT {
    ?region iut:population ?population ;
    		iut:area ?area .
} WHERE {
    # Partie GraphDB
    {
        SELECT ?region ?regionName WHERE {
            ?region rdf:type iut:Region ;
                    iut:regionName ?regionName .
        }
    }

    # Partie Wikidata
    SERVICE <https://query.wikidata.org/sparql> {
        ?continent wdt:P31 wd:Q5107 ;
                   rdfs:label ?continentLabel ;
                   wdt:P1082 ?population ;
        		   wdt:P2046 ?area .
        
    	FILTER(str(?regionName) = str(?continentLabel))
    }
}
```

## 5. Répondez à la question décrite à l'étape 1.

Avant de pouvoir répondre au questions, nous avons d'abord effectuer quelques test en effectuant des requêtes. Si vous souhaitez les consultez elles sont dans le fichier [query.md](https://github.com/LePeruvienn/BUT3-Web-Semantique/blob/main/rdf/query.md) du projet.


## 6. Visualisez les résultats de cette requête dans une application



## 7. Documentez le processus qui a mené à la mise en œuvre.
