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

```sparql
SELECT * WHERE {
    # ...
}
```
