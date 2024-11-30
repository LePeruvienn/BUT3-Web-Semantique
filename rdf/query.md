# Querys

Liste des requête qui ont contribuer au projet.

## GraphDB

Ici on as toutes les reqûtes qui on été faites avec les données de **OntoRefine** sur **GraphDB**. Elle ont permis par la suite de construire les requête avec **Wikidata** et **GraphDB**.

### Affichage des pays avec le plus de désastre

Ici on veut afficher les pays avec leurs nombre de catastrophe naturel dans l'odre décroissant pour connaitre les pays avec le plus de catastrophe

```sparql
PREFIX iut: <https://cours.iut-orsay.fr/app/npbd/projet/apinel2/>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX wd: <http://www.wikidata.org/entity/>
PREFIX wdt: <http://www.wikidata.org/prop/direct/>
PREFIX wikibase: <http://wikiba.se/ontology#>

select ?countryName (COUNT(?disaster) AS ?nbPays) where {

    ?disaster rdf:type iut:Disaster;
    	iut:occuredIn ?location .
    
    ?location iut:isInCountry ?country .
    ?country iut:countryName ?countryName
    
} 
GROUP BY ?country ?countryName
ORDER BY DESC (?nbPays)
LIMIT 3
```

Résultats de la requête :

| Pays                        | Nombre de catastrophes   |
|-----------------------------|--------------------------|
| China                       | 1349                     |
| India                       | 810                      |
| United States of America    | 711                      |

### Affichage des continents avec le plus de désastre

Ici on veut affichier les continent avec le plus de désastre dans l'odre déscroissant pour savoir quelle continent à le plus de catastrophe.

```sparql
PREFIX iut: <https://cours.iut-orsay.fr/app/npbd/projet/apinel2/>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX wd: <http://www.wikidata.org/entity/>
PREFIX wdt: <http://www.wikidata.org/prop/direct/>
PREFIX wikibase: <http://wikiba.se/ontology#>

select ?regioName (COUNT(?disaster) AS ?nb) where {

    ?disaster rdf:type iut:Disaster;
    	iut:occuredIn ?location .
    
    ?location iut:isInCountry ?country .
    ?country iut:isInRegion ?region .
    ?region iut:regionName ?regioName .
    
} 
GROUP BY ?region ?regioName
ORDER BY DESC (?nb)
```
Résultats de la requête :

| Région       | Nombre de catastrophes   |
|--------------|--------------------------|
| Asia         | 6475                     |
| Africa       | 4128                     |
| Americas     | 3161                     |
| Europe       | 1861                     |
| Oceania      | 405                      |



### Affichage des pays avec les désastre qui ont eu le plus d'impact humain

```sparql
PREFIX iut: <https://cours.iut-orsay.fr/app/npbd/projet/apinel2/>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX wd: <http://www.wikidata.org/entity/>
PREFIX wdt: <http://www.wikidata.org/prop/direct/>
PREFIX wikibase: <http://wikiba.se/ontology#>

select ?countryName (SUM(?totalAffected) as ?tot) where {

    ?disaster rdf:type iut:TechnologicalDisaster;
    	iut:occuredIn ?location ;
    	iut:hasImpact ?impact .
    
    ?impact rdf:type iut:HumanImpact ;
    		iut:totalAffected ?totalAffected .
    
    ?location iut:isInCountry ?country .
    ?country iut:countryName ?countryName
}
GROUP BY ?country ?countryName
ORDER BY DESC (?tot)
LIMIT 3
```

| Pays     | Nombre de personne affectées |
|----------|------------------------------|
| Brazil   | 558877                       |
| Lebanon  | 306174                       |
| China    | 284408                       |


## Wikidata

Ici on as toutes les reqûtes qui on été faites sur **Wikidata**. Elle ont permis par la suite de construire les requête avec **Wikidata** et **GraphDB**.


### Affichage de l'alpha code de tout les pays

```sparql
SELECT * WHERE {
  ?pays wdt:P31 wd:Q3624078 ;
        wdt:P298 ?alpha3code.
}
```

## GraphDB + WikiData

Et le résultat finales ici on as toutes les requêtes qui ont permis de répondre à nos questions.

### Récupération des pays de wikidata et affichage de leurs espérance de vie

```sparql
PREFIX iut: <https://cours.iut-orsay.fr/app/npbd/projet/apinel2/>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX wd: <http://www.wikidata.org/entity/>
PREFIX wdt: <http://www.wikidata.org/prop/direct/>
PREFIX wikibase: <http://wikiba.se/ontology#>

select ?cname ?lifeExpancy where {
    
	# On récupère le code des pays et leurs noms
    ?s rdf:type iut:Country ;
    	iut:code ?alpha ;
    	iut:countryName ?cname .
    
    # partie de la requête executé sur Wikidata
    SERVICE <https://query.wikidata.org/bigdata/namespace/wdq/sparql> {
        ?pays wdt:P31 wd:Q3624078 ;
        	wdt:P298 ?alpha ;
            wdt:P2250 ?lifeExpancy .
    }
    
} limit 100
```

| Pays      | Espérance de vie (en années) |
|-----------|-----------------------------|
| Canada    | 83.62                       |
| Japan     | 83.98                       |
| Norway    | 82.51                       |
| Ireland   | 81.61                       |
| Hungary   | 70.68                       |
| ...       | ...                         |

