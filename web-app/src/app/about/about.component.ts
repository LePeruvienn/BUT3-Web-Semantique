import { Router } from '@angular/router';
import { Component,Output ,EventEmitter,inject} from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { HttpClientModule, provideHttpClient, withFetch , HttpClient } from '@angular/common/http'; // Import HttpClientModule
import * as d3 from 'd3';
import * as $rdf from 'rdflib';
import { ChartData, ChartOptions } from 'chart.js';


@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})

export class AboutComponent {
  router = inject(Router)

  NaviagatetoMonument(){
    this.router.navigate(['/monument-hub'])
  }

  sparqlEndpoint:string = "http://localhost:7200/repositories/ProjectS5";

  listStrings: string[] = [
    `PREFIX iut: <https://cours.iut-orsay.fr/app/npbd/projet/apinel2/>
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
}`,
`PREFIX iut: <https://cours.iut-orsay.fr/app/npbd/projet/apinel2/>
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
}`,
`PREFIX iut: <https://cours.iut-orsay.fr/app/npbd/projet/apinel2/>
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
GROUP BY ?countryName ?population
ORDER BY DESC(?ratio)
LIMIT 3`,
`PREFIX iut: <https://cours.iut-orsay.fr/app/npbd/projet/apinel2/>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

SELECT ?countryName (SUM(?deaths) AS ?totalDeaths) ?population ((?totalDeaths / ?population) AS ?ratio)
WHERE {
    ?disaster rdf:type iut:Disaster ;
              iut:occuredIn ?location ;
    		  iut:hasImpact ?impact .

    ?location iut:isInCountry ?country .

    ?impact rdf:type iut:HumanImpact ;
    		iut:totalDeath ?deaths .

    ?country iut:countryName ?countryName ;
             iut:population ?population .

}
GROUP BY ?countryName ?population
ORDER BY DESC(?ratio)
LIMIT 3`,
`PREFIX iut: <https://cours.iut-orsay.fr/app/npbd/projet/apinel2/>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

SELECT ?countryName (SUM(?affected) AS ?totalAffected) ?population ((?totalAffected / ?population) AS ?ratio)
WHERE {
    ?disaster rdf:type iut:NaturalDisaster ;
              iut:occuredIn ?location ;
    		  iut:hasImpact ?impact .

    ?location iut:isInCountry ?country .

    ?impact rdf:type iut:HumanImpact ;
    		iut:totalAffected ?affected .

    ?country iut:countryName ?countryName ;
             iut:population ?population .

}
GROUP BY ?countryName ?population
ORDER BY DESC(?ratio)
LIMIT 3`,
`PREFIX iut: <https://cours.iut-orsay.fr/app/npbd/projet/apinel2/>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

SELECT ?countryName (SUM(?deaths) AS ?totalDeaths) ?population ((?totalDeaths / ?population) AS ?ratio)
WHERE {
    ?disaster rdf:type iut:NaturalDisaster ;
              iut:occuredIn ?location ;
    		  iut:hasImpact ?impact .

    ?location iut:isInCountry ?country .

    ?impact rdf:type iut:HumanImpact ;
    		iut:totalDeath ?deaths .

    ?country iut:countryName ?countryName ;
             iut:population ?population .

}
GROUP BY ?countryName ?population
ORDER BY DESC(?ratio)
LIMIT 3`,
`PREFIX iut: <https://cours.iut-orsay.fr/app/npbd/projet/apinel2/>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

SELECT ?countryName (SUM(?affected) AS ?totalAffected) ?population ((?totalAffected / ?population) AS ?ratio)
WHERE {
    ?disaster rdf:type iut:TechnologicalDisaster ;
              iut:occuredIn ?location ;
    		  iut:hasImpact ?impact .

    ?location iut:isInCountry ?country .

    ?impact rdf:type iut:HumanImpact ;
    		iut:totalAffected ?affected .

    ?country iut:countryName ?countryName ;
             iut:population ?population .

}
GROUP BY ?countryName ?population
ORDER BY DESC(?ratio)
LIMIT 3`,
`PREFIX iut: <https://cours.iut-orsay.fr/app/npbd/projet/apinel2/>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

SELECT ?countryName (SUM(?deaths) AS ?totalDeaths) ?population ((?totalDeaths / ?population) AS ?ratio)
WHERE {
    ?disaster rdf:type iut:TechnologicalDisaster ;
              iut:occuredIn ?location ;
    		  iut:hasImpact ?impact .

    ?location iut:isInCountry ?country .

    ?impact rdf:type iut:HumanImpact ;
    		iut:totalDeath ?deaths .

    ?country iut:countryName ?countryName ;
             iut:population ?population .

}
GROUP BY ?countryName ?population
ORDER BY DESC(?ratio)
LIMIT 3`,
`PREFIX iut: <https://cours.iut-orsay.fr/app/npbd/projet/apinel2/>
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
LIMIT 3`,
`PREFIX iut: <https://cours.iut-orsay.fr/app/npbd/projet/apinel2/>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
SELECT ?countryName (SUM(xsd:decimal(?damages)) AS ?totalDamages) ?gdp ((xsd:decimal(?totalDamages) / xsd:decimal(?gdp)) AS ?ratio)
WHERE {
    ?disaster rdf:type iut:NaturalDisaster ;
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
LIMIT 3`,
`PREFIX iut: <https://cours.iut-orsay.fr/app/npbd/projet/apinel2/>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
SELECT ?countryName (SUM(xsd:decimal(?damages)) AS ?totalDamages) ?gdp ((xsd:decimal(?totalDamages) / xsd:decimal(?gdp)) AS ?ratio)
WHERE {
    ?disaster rdf:type iut:TechnologicalDisaster ;
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
LIMIT 3`,
  ]

  selectedRequest: number = 0;

listCountryData = [
  {Country: "", Value: 0},
];
showGraph: boolean = false; // Controls the visibility of the section
public chartData: ChartData<'bar'> = {
  labels: [], // dynamic labels from SPARQL query
  datasets: [
    {
      label: 'Number of Courses',
      data: [], // dynamic data from SPARQL query
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1
    }
  ]
};

public chartOptions: ChartOptions = {
  responsive: true,
  scales: {
    y: {
      beginAtZero: true
    }
  }
};

constructor(private http: HttpClient) {}

queryRequestToGraphDB(index:number): void {

  const input_endpoint = document.getElementById(`sparqlEndpoint`) as HTMLInputElement;

  if (!input_endpoint) return console.error ("Error sparqlEndpoint input has not the wright id");

  if (input_endpoint.value !== "")
    this.sparqlEndpoint = input_endpoint.value;

  const endpointUrl = this.sparqlEndpoint;
  const sparqlQuery = this.listStrings[index];

  console.log ("SPARQL Endpoint = ", endpointUrl);

    const button = document.getElementById(`button-${index}`);
    const res = document.getElementById(`result-${index}`);

    if (!button) return console.error ("Error button id dont exist")

    if (res) res.remove();

    // Creating result div
    const new_res = document.createElement("div");
    new_res.id = `result-${index}`;

  this.http.get(`${endpointUrl}?query=${encodeURIComponent(sparqlQuery)}`, {
    headers: {
      'Accept': 'application/sparql-results+json',
      'Content-Type': 'application/sparql-results+json'
    }
  }).subscribe(
    (data: any) => {

      // Creating delete button
      const delete_button = document.createElement('button');
      delete_button.textContent = 'delete Table';
      delete_button.onclick = () => this.deleteResult(index);

      //Creating table
      const table = this.createTable(data);
      //Creaing graph
      const svg = document.createElement("svg");
      svg.id = `svg-${index}`;

      // Adding elements to div
      new_res.appendChild(table);
      new_res.appendChild(delete_button);
      new_res.appendChild(svg);

      // Drawing Graph
      this.createGraph(data, index);
      console.log(data);
    },
    error => {
      const error_elt = document.createElement("p");
      error_elt.innerText = error.error;
      error_elt.style.color = 'white';
      error_elt.style.backgroundColor = '#f44336';  // Red background
      error_elt.style.border = '1px solid #d32f2f';  // Dark red border
      error_elt.style.padding = '10px';
      error_elt.style.borderRadius = '5px';
      error_elt.style.fontWeight = 'bold';
      error_elt.style.marginTop = '10px';
      error_elt.style.fontFamily = 'Arial, sans-serif';
      new_res.appendChild(error_elt);
    }
  );

  button.insertAdjacentElement("afterend", new_res);
}

customQuery(): void {

  const button = document.getElementById(`button-custom`);
  if (!button) return console.error ("Error button id dont exist")

  const res = document.getElementById(`result-custom`);

  if (res) res.remove();

  // Creating result div
  const new_res = document.createElement("div");
  new_res.id = `result-custom`;

  const endpointUrl = 'http://localhost:7200/repositories/ProjectS5';
  const textarea = document.getElementById("customQuery") as HTMLTextAreaElement;
  if (!textarea) return console.error ("Error text area id not worked");
  const sparqlQuery = textarea.value;

  console.log(sparqlQuery)

  this.http.get(`${endpointUrl}?query=${encodeURIComponent(sparqlQuery)}`, {
    headers: {
      'Accept': 'application/sparql-results+json',
      'Content-Type': 'application/sparql-results+json'
    }
  }).subscribe(
    (data: any) => {

      //Creating table
      const table = this.createTable(data);

      // Adding elements to div
      new_res.appendChild(table);
    },
    error => {
      const error_elt = document.createElement("p");
      error_elt.innerText = error.error;
      error_elt.style.color = 'white';
      error_elt.style.backgroundColor = '#f44336';  // Red background
      error_elt.style.border = '1px solid #d32f2f';  // Dark red border
      error_elt.style.padding = '10px';
      error_elt.style.borderRadius = '5px';
      error_elt.style.fontWeight = 'bold';
      error_elt.style.marginTop = '10px';
      error_elt.style.fontFamily = 'Arial, sans-serif';
      new_res.appendChild(error_elt);
    }
  );
  button.insertAdjacentElement("afterend", new_res);
}

deleteResult (index:number):void {

  const res = document.getElementById(`result-${index}`);

  if (!res) return console.error ("Error error res index on delete");

  res.remove()
}

createTable(data: any): HTMLElement {
  const table = document.createElement('table');

  // Applying styles directly to the table
  table.style.width = '100%';
  table.style.borderCollapse = 'collapse';
  table.style.margin = '20px 0';

  const headers = data.head.vars;
  const headerRow = document.createElement('tr');

  // Create and style header cells
  for (const head of headers) {
    const th = document.createElement('th');
    th.textContent = head;

    // Apply styles to th
    th.style.backgroundColor = '#007bff';
    th.style.color = 'white';
    th.style.border = '1px solid #ddd';
    th.style.padding = '10px';
    th.style.textAlign = 'left';

    headerRow.appendChild(th);
  }

  // Append header row to the table
  table.appendChild(headerRow);

  // Create rows for the table body
  const bindings = data.results.bindings;
  for (const vals of bindings) {
    const row = document.createElement('tr');

    // For each value, create a td element
    for (const header of headers) {
      const td = document.createElement('td');
      td.textContent = vals[header] ? vals[header].value : '';

      // Apply styles to td
      td.style.border = '1px solid #ddd';
      td.style.padding = '10px';
      td.style.textAlign = 'left';

      row.appendChild(td);
    }

    // Append row to the table
    table.appendChild(row);
  }

  return table;
}

  createGraph(_data:any, index:number): void { //D3 GRAPH
    // Extract country names and ratios from the SPARQL result
    const countries = _data.results.bindings.map((binding: any) => binding.countryName.value);
    const ratios = _data.results.bindings.map((binding: any) => parseFloat(binding.ratio.value));

  }
}
