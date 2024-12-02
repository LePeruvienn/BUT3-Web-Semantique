import { Component,Output ,EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { HttpClientModule, provideHttpClient, withFetch , HttpClient } from '@angular/common/http'; // Import HttpClientModule
import * as d3 from 'd3';
import * as $rdf from 'rdflib';
import { AboutComponent } from './../about/about.component'
import { ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-monument-hub',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule], 
  templateUrl: './monument-hub.component.html',
  styleUrls: ['./monument-hub.component.css'],
})


export class MonumentHubComponent{
    listRequest: string[] = ['Pays avec le plus de désastre', '.', '.', '.', '.'];
    selectedRequest: string = '';
    listQuery: string[] = [ `
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
      LIMIT 5
      `, '.', '.', '.', '.'];
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
  private metric: string = "absolute"; // "absolute" or "percentage"
  private width: number = 800; // Chart width

  constructor(private http: HttpClient) {}

  LoadData() {
    console.log ("SHOW RESULTS")
    this.getResponseMessage()
    this.queryRequestToGraphDB()
  }

  showResults(): void {
    this.createGraph();
  }

  getResponseMessage(): string {
    switch (this.selectedRequest) {
      case 'Pays avec le plus de désastre':
        return this.selectedQuery = this.listQuery[0];
      case 'Request 2':
        return 'This is the second request. Great choice!';
      case 'Request 3':
        return 'Ah, the third request, an excellent pick!';
      default:
        return 'Please select a valid request.';
    }
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
         this.listCountryData = data.results.bindings.map((binding: { countryName: { value: any; }; nbPays: { value: string; }; }) => ({
          Country: binding.countryName.value,
          Value: parseInt(binding.nbPays.value, 10),
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


    // Select the container (with id="chart") and ensure it's available
    const container = d3.select("#chart").node() as HTMLElement;
    
    if (container) {
      // Append the SVG node to the container
      const child = d3.select("#child").node() as HTMLElement;
      if (child){
        container.removeChild(child);
      }
      container.appendChild(svg.node()!);
    } else {
      console.error("Element with id 'chart' not found.");
    }
  }
}