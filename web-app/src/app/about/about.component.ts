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
}`
  ]

  selectedRequest: number = 0;

  listQuery: string[] = [
    `PREFIX iut: <https://cours.iut-orsay.fr/app/npbd/projet/apinel2/>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX wd: <http://www.wikidata.org/entity/>
PREFIX wdt: <http://www.wikidata.org/prop/direct/>
PREFIX wikibase: <http://wikiba.se/ontology#>

select ?name (COUNT(?disaster) AS ?nb) where {

?disaster rdf:type iut:Disaster;
  iut:occuredIn ?location .

?location iut:isInCountry ?country .
?country iut:countryName ?name

}
GROUP BY ?country ?name
ORDER BY DESC (?nb)
LIMIT 5
`, //0 case `Pays avec le plus de désastre`:

`PREFIX iut: <https://cours.iut-orsay.fr/app/npbd/projet/apinel2/>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX wd: <http://www.wikidata.org/entity/>
PREFIX wdt: <http://www.wikidata.org/prop/direct/>
PREFIX wikibase: <http://wikiba.se/ontology#>

select ?name (COUNT(?disaster) AS ?nb) where {

  ?disaster rdf:type iut:Disaster;
    iut:occuredIn ?location .

  ?location iut:isInCountry ?country .
  ?country iut:isInRegion ?region .
  ?region iut:regionName ?name .

}
GROUP BY ?region ?name
ORDER BY DESC (?nb)`,//1 case `Continents avec le plus de désastre`:

`PREFIX iut: <https://cours.iut-orsay.fr/app/npbd/projet/apinel2/>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX wd: <http://www.wikidata.org/entity/>
PREFIX wdt: <http://www.wikidata.org/prop/direct/>
PREFIX wikibase: <http://wikiba.se/ontology#>

select ?name ?nb where {

# On récupère le code des pays et leurs noms
  ?s rdf:type iut:Country ;
    iut:code ?alpha ;
    iut:countryName ?name .

  # partie de la requête executé sur Wikidata
  SERVICE <https://query.wikidata.org/bigdata/namespace/wdq/sparql> {
      ?pays wdt:P31 wd:Q3624078 ;
        wdt:P298 ?alpha ;
          wdt:P2250 ?nb .
  }

} limit 10`, //2 case `Espérance de vie`:

`PREFIX iut: <https://cours.iut-orsay.fr/app/npbd/projet/apinel2/>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

SELECT ?name (SUM(?affected) AS ?totalAffected) ?population ((?totalAffected / ?population) AS ?nb)
WHERE {
  ?disaster rdf:type iut:Disaster ;
            iut:occuredIn ?location ;
            iut:hasImpact ?impact .

  ?location iut:isInCountry ?country .

  ?impact rdf:type iut:HumanImpact ;
          iut:totalAffected ?affected .

  ?country iut:countryName ?name ;
           iut:population ?population .

}
GROUP BY ?name ?population ?idh
ORDER BY DESC(?nb)
LIMIT 6`,//3 case `Pays les plus affecter par les desastres`:
``,//4 case `Ration de mort par desastres`:
``,//5 case `Ration de mort par desastres naturel`:
``,//6 case `Ration de mort par desastres technologique`:
``,
``,
];//3
  selectedQuery: string = '';

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

LoadData(number: number) {
  console.log ("SHOW RESULTS");
  this.selectedRequest = number;
  this.selectedQuery = this.listQuery[this.selectedRequest]
  this.queryRequestToGraphDB();
  setTimeout(() => {
    this.createGraph();
  }, 500);
}

showResults(): void {
  this.createGraph();
}


queryRequestToGraphDB(): void {
  const endpointUrl = 'http://localhost:7200/repositories/ProjectS5';
  const sparqlQuery = this.selectedQuery;
  console.log(sparqlQuery)

  this.http.get(`${endpointUrl}?query=${encodeURIComponent(sparqlQuery)}`, {
    headers: {
      'Accept': 'application/sparql-results+json',
      'Content-Type': 'application/sparql-results+json'
    }
  }).subscribe(
    (data: any) => {
      this.chartData.labels = []; // Reset labels
      this.chartData.datasets[0].data = []; // Reset data

      // Populate chart with fetched results

      data.results.bindings.forEach((val: any) => {
        if(this.chartData.labels)
          this.chartData.labels.push(val.teacher);
        this.chartData.datasets[0].data.push(parseInt(val.nbr_courses, 10)); // Add course counts to data
      });
       this.listCountryData = data.results.bindings.map((binding: { name: { value: any; }; nb: { value: string; }; }) => ({
        Country: binding.name.value,
        Value: parseInt(binding.nb.value, 10),
      }));
      console.log(data);
      console.log(this.listCountryData);
    },
    error => {
      console.error('Error fetching data from GraphDB:', error);
    }
  );
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
