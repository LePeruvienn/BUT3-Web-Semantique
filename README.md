# BUT3 Projet Web Sémantique

https://leperuvienn.github.io/BUT3-Web-Semantique/

## Prérequis

- Avoir un serveur locale **GraphDB**
- Importer les données necessaire :
    - [construct_country.ttl](https://github.com/LePeruvienn/BUT3-Web-Semantique/blob/main/rdf/construct_country.ttl)
    - [construct_region.ttl](https://github.com/LePeruvienn/BUT3-Web-Semantique/blob/main/rdf/construct_region.ttl)
    - [triples.ttl](https://github.com/LePeruvienn/BUT3-Web-Semantique/blob/main/rdf/triples.ttl)
    - [ontologie.ttl](https://github.com/LePeruvienn/BUT3-Web-Semantique/blob/main/rdf/ontologie.ttl)

- Avoir un **SPARQL EndPoint** fonctionnel.

## 1. Trouver une question intéressante à laquelle répondre.

Après avoir receuilli des donnés depuis le site internet [ourworldindata](https://ourworldindata.org/natural-disasters) sur les différentes catastrophes naturelles. Vous pouvez retrouver les données dans le fichier [disasters_data.xlsx](https://github.com/LePeruvienn/BUT3-Web-Semantique/blob/main/data_set/distasters_data.xlsx).

Nous avons alors voulu répondre à cette question :

- ### Quelles sont les pays les plus impacté par les catastrophes naturelle et technologique ?

Grace à cette grande questions nous pourrons, répondre notamment à plusieurs question secondaires, comme par exemple :

- **Quelles sont les pays les plus affecter humainement par ces désastre ?**
    - Pour les catastrophe naturelle et technologique
    - Par rapport au nombre de personne personne affecté
    - Par rapport au nombre de décès

- **Quelles sont les pays qui sont le plus touché par les désastres économiquement?**
    - Pour les catastrophe naturelle et technologique
    - Par rapport à leurs PIB

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

### Quelles sont les pays les plus affecter humainement par ces désastre ?

- Pour les catastrophe naturelle et technologique
- Par rapport au nombre de personne personne affecté
- Par rapport au nombre de décès

#### Requête de base

Voici la requête de base, on fera varier les paramêtres pour répondre à tout.

- On fera varier le `rdf:type` de `?disaster` en fonction de si on veut une catastrophe naturelle ou technologique.

- On fera varier la propritété `iut:totalAffected` de `?impact` en `iut:totalDeath`, en fonction de si on veut le nombre de mort ou le nombre total de personne affecté

*Exemple pour le nombre de personne affecté pour tout désastre confondu*
```sparql
PREFIX iut: <https://cours.iut-orsay.fr/app/npbd/projet/apinel2/>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

SELECT ?countryName (SUM(?affected) AS ?totalAffected) ?population ((?totalAffected / ?population) AS ?ratio)
WHERE {
    ?disaster rdf:type iut:Disaster ;
              iut:occuredIn ?location ;
    		  iut:hasImpact ?impact .
    
    ?location iut:isInCountry ?country .
    
    ?impact rdf:type iut:HumanImpact ;
    		iut:totalAffected ?affected .
    
    ?country iut:countryName ?countryName ;
             iut:population ?population .

}
GROUP BY ?countryName ?population ?idh
ORDER BY DESC(?ratio)
LIMIT 3
```

**En Général** : 

- Pour le nombre de personne affectées

| countryName                           | totalAffected | population   | ratio                          |
|---------------------------------------|---------------|--------------|--------------------------------|
| Vanuatu                               | 1073374       | 300019       | 3.577686746506054616540952     |
| Micronesia (Federated States of)      | 270062        | 105544       | 2.558762222390661714545592     |
| Cuba                                  | 24231034      | 10985974     | 2.205633656151015831641327     |

! **Vanatu** est loin devant avec plus de 3 fois sa population actuelles, qui as été affecté par des catastrophes.

- Pour le nombre de personne décèdées

| countryName | totalDeaths   | population | ratio                              |
|-------------|---------------|------------|------------------------------------|
| Haiti       | 241267        | 10981229   | 0.021970855903287327857383        |
| Libya       | 18305         | 6678567    | 0.002740857432440222580682        |
| Myanmar     | 141746        | 53370609   | 0.002655881254793251469175        |

! **Haiti** est loin devant avec plus de **2%** de sa population actuelle qui est morte lors de catastrophes.

**Pour les catastrophe naturelle** :

- Le résultats **ne change pas** par rapport à en **général**

**Pour les catastrophe technologique** :

- Pour le nombre de personne affectées

| countryName | totalAffected | population | ratio                              |
|-------------|---------------|------------|------------------------------------|
| Maldives    | 215886        | 436330     | 0.494776889051864414548621        |
| Lebanon     | 306174        | 6100075    | 0.050191841903583152666156        |
| Panama      | 81949         | 4098587    | 0.019994451746418948774297        |

! Les **Maldives** sont loin devant avec **la moitié** de sa population qui as été affecté par des catastrophe technologique.

- Pour le nombre de personne décèdées

| countryName  | totalDeath    | population | ratio                             |
|--------------|---------------|------------|-----------------------------------|
| Tuvalu       | 18            | 11792      | 0.001526458616010854816825        |
| Libya        | 5085          | 6678567    | 0.000761390879211064289690        |
| Gambia       | 1914          | 2639916    | 0.000725023068915829140018        |

! **Tuvalu** loin devant avec **0.15%** de sa population acutelle morte dans des catastrophe technologique.

#### Conclusion

Les pays les plus affecté humainement sont ceux par des catastrophes **naturelle**. Les catastrophea **technologique** ont moins d'impact, sauf pour les **Maldives** dans lequels il représente **la moitée** de la population.

Sinon les 2 pays les plus affecté humainenemnt sont **Haiti** et **Vanatu**.

### Quelles sont les pays qui sont le plus touché par les désastres économiquement?

- Pour les catastrophe naturelle et technologique
- Par rapport à leurs PIB

#### Requête de base

Voici la requête de base, on fera varier les paramêtres pour répondre à tout.

- On fera varier le `rdf:type` de `?disaster` en fonction de si on veut une catastrophe naturelle ou technologique.

```sparql
PREFIX iut: <https://cours.iut-orsay.fr/app/npbd/projet/apinel2/>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
SELECT ?countryName (SUM(xsd:decimal(?damages)) AS ?totalDamages) ?gdp ((xsd:decimal(?totalDamages) / xsd:decimal(?gdp)) AS ?ratio)
WHERE {
    ?disaster rdf:type iut:Disaster ;
              iut:occuredIn ?location ;
    		  iut:hasImpact ?impact .
    
    ?location iut:isInCountry ?country .
    
    ?impact rdf:type iut:EconomicImpact ;
    		iut:totalDamage ?damages .
    
    ?country iut:countryName ?countryName ;
             iut:gdp ?gdp .
}
GROUP BY ?countryName ?gdp
ORDER BY DESC(?ratio)
LIMIT 3
```

**En Général** : 

| countryName | totalDamage  | gdp               | ratio                              |
|-------------|--------------|-------------------|------------------------------------|
| Dominica    | 1958810      | 562540740.740741  | 0.003482076689095767590526        |
| Haiti       | 12484591     | 8408150517.97684  | 0.001484820112735568470685        |
| Grenada     | 1319000      | 1118816679.40741  | 0.001178924147518625357443        |

! On voit que la **Dominique** est 3 fois plus grandes que les 2 autres. C'est elle est qui est le plus touché économiquement. Avec **0.3%** de son PIB qui équivaut au dégats subit par des catastrophe naturelle.

**Pour les catastrophes naturelle** : 

- Meme chose que pour **En Général**.

**Pour le catastrophes technologique** : 

| countryName | totalDamage  | gdp               | ratio                              |
|-------------|--------------|-------------------|------------------------------------|
| Lebanon     | 15000000     | 51844487742.0232  | 0.000289326805091403416535        |
| Ukraine     | 867000       | 112154185121.406  | 0.000007730429310876624881        |
| Spain       | 10098407     | 1311320015515.99  | 0.000007700947808705861887        |

! Complétement différent que pour les catastrophe naturelle. **Lebanon** est très **loin devant** mais sinon les autres pays sont négigable.

#### Conclusion

La **Dominique** est a plus touché par les catastrophe économiquement, mais sinon on revoit apparaitre **Haiti** en deuxième place.

## 6. Visualisez les résultats de cette requête dans une application

Afin de pouvoir présentez notre travail nous avons utilisé le framework Angular que vous avons lié à l'API de graphDB afin de pouvoir executé nos requetes. Tout le code source de l'application est sur le Github. Vous pouvez acceder au site internet en cliquand sur ce [lien](https://leperuvienn.github.io/BUT3-Web-Semantique/).

## 7. Documentez le processus qui a mené à la mise en œuvre.

Le `README.md` résume toutes les étapes du projet et comment on as répondu à la question. La site internet répertorie aussi toute la document avec une versions plus intéractive ou on peu lancer les requetes directement sur le [site web](https://leperuvienn.github.io/BUT3-Web-Semantique/).

## 8. Conclusion !

Au cours de ce projet, nous avons importé et traité un grand volume de données afin d'explorer et de répondre à nos questions. Cependant, malgré les efforts déployés, nous avons constaté que toutes les données importées n'ont pas pu être pleinement exploitées. Certaines d'entre elles se sont révélées inutiles pour répondre à nos objectifs, tandis que d'autres ont généré des résultats trop limités ou insuffisamment satisfaisants pour apporter une réelle valeur ajoutée à l'analyse.

Ces limitations nous rappellent l'importance d'une phase de sélection et de pré-traitement des données en amont, ainsi que les défis inhérents à la gestion des données hétérogènes et complexes. Néanmoins, ce travail nous a permis de mieux comprendre les enjeux liés à l'analyse des catastrophes naturelles et technologiques, tout en identifiant des pistes pour améliorer l'exploitation des données dans de futurs projets.
