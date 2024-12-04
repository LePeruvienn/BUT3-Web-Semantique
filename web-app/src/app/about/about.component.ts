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

showResults(): void {
  this.createGraph();
}


queryRequestToGraphDB(index:number): void {
  const endpointUrl = 'http://localhost:7200/repositories/ProjectS5';
  const sparqlQuery = this.listStrings[index];
  console.log(sparqlQuery)

  this.http.get(`${endpointUrl}?query=${encodeURIComponent(sparqlQuery)}`, {
    headers: {
      'Accept': 'application/sparql-results+json',
      'Content-Type': 'application/sparql-results+json'
    }
  }).subscribe(
    (data: any) => {
      const button = document.getElementById(`button-${index}`);
      const res = document.getElementById(`result-${index}`);

      if (!button) return console.error ("Error button id dont exist")

      if (res) res.remove();

      const new_res = document.createElement("div");
      new_res.id = `result-${index}`;

      const delete_button = document.createElement('button');
      delete_button.textContent = 'delete Table';
      delete_button.onclick = () => this.deleteResult(index);

      new_res.appendChild(this.createTable(data));
      new_res.appendChild(delete_button);

      button.insertAdjacentElement("afterend", new_res);
      console.log(data);
    },
    error => {
      console.error('Error fetching data from GraphDB:', error);
    }
  );
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

createGraph(): void { //D3 GRAPH

  const data = this.listCountryData.map(d => ({
    Country: d.Country,
    Value: d.Value,
  }));

// Specify the chart’s dimensions.
const width = 928;
const height = 500;
const marginTop = 20;
const marginRight = 0;
const marginBottom = 30;
const marginLeft = 40;

// Create the horizontal scale and its axis generator.
const x = d3.scaleBand()
  .domain(data.map(d => d.Country)) // Use Country for the x axis
  .range([marginLeft, width - marginRight])
  .padding(0.1);

const xAxis = d3.axisBottom(x).tickSizeOuter(0);

// Create the vertical scale.
const y = d3.scaleLinear()
  .domain([0, d3.max(data, d => d.Value) ?? 0])
  .range([height - marginBottom, marginTop]);

// Create the SVG container.
const svg = d3.create("svg")
  .attr("viewBox", [0, 0, width, height])
  .attr("width", width)
  .attr("height", height)
  .attr("style", "max-width: 100%; height: auto;")
  .attr("class", "child");

// Append the bars.
svg.append("g")
  .attr("class", "bars")
  .attr("fill", "steelblue")
.selectAll("rect")
.data(data)
.join("rect")
  .attr("x", d => x(d.Country) ?? 0) // Use Country for x-axis positioning
  .attr("y", d => y(d.Value) ?? 0) // Use Value for the y-axis
  .attr("height", d => Math.max(0, y(0) - y(d.Value))) // Ensure height is never undefined or negative
  .attr("width", x.bandwidth());

// Append the axes.
svg.append("g")
  .attr("class", "x-axis")
  .attr("transform", `translate(0,${height - marginBottom})`)
  .call(xAxis);

svg.append("g")
  .attr("class", "y-axis")
  .attr("transform", `translate(${marginLeft},0)`)
  .call(d3.axisLeft(y))
  .call(g => g.select(".domain").remove());



  const chartId = `chart${this.selectedRequest}`;

  // Select the container (with id="chart") and ensure it's available
  const container = d3.select(`#${chartId}`).node() as HTMLElement;
  if (container) {

    // Append the SVG node to the container
    const child = d3.select("#child").node() as HTMLElement | null;
    d3.select(`#${chartId} svg`).remove()

    container.appendChild(svg.node()!);
  } else {
    console.error("Element with id 'chart' not found.");
  }
}


}
