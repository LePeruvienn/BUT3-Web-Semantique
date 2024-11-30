# Querys

## Wikidata 

- Informations sur les pays

```sparql
SELECT * WHERE {
  ?pays wdt:P31 wd:Q3624078 ;
        wdt:P298 ?alpha3code ;
        rdfs:label ?label .
}
```


- Informations sur les catastrophe

```sparql
SELECT * WHERE {
        
   ?disaster wdt:P31 wd:Q3839081 ;
             wdt:P17 ?country ;
             wdt:P585 ?date ;
             wdt:P1120 ?mort ;
             wdt:P625 ?coord .             
             
   OPTIONAL {
     ?disaster wdt:P10 ?video .
   }
}
```

## GraphDB

Récupération des pays de wikidata et affichage de leurs espérance de vie

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

Affichage des pays avec le plus de désastre


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
```

Affichage des continents avec le plus de désastre 

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

Affichage des pays avec les désastre qui ont eu le plus d'impact humain

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
```
