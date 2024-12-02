import { Component,Output ,EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { FormsModule } from '@angular/forms'; // Import FormsModule
import * as d3 from 'd3';
import * as $rdf from 'rdflib';
import { HttpClient } from '@angular/common/http';
import { AboutComponent } from './../about/about.component'
import { SharedService } from '../shared.service';
import { query } from '@angular/animations';


@Component({
  selector: 'app-monument-hub',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './monument-hub.component.html',
  styleUrls: ['./monument-hub.component.css'],
})


export class MonumentHubComponent{
  query: string = '';
  _results: any[] = [];
  _parseData: { Country: string; Value: string }[] = []; 
  listCountryData = [
    {Country: "", Value: 0},
  ];
  showGraph: boolean = false; // Controls the visibility of the section

  private metric: string = "absolute"; // "absolute" or "percentage"
  private width: number = 800; // Chart width


  constructor(private sharedService: SharedService) {}

  get data(): string {
    return this.sharedService.getData();
  }
  
  getText(): void {
    const textarea = document.getElementById('myTextarea') as HTMLTextAreaElement;
    if (textarea) {
      this.query = textarea.value;
    }
  }

  LoadData() {
    const n3Data = this.data
    this.getText();
    this.queryRequestToData(n3Data,this.query)
  }

  showResults(): void {
    console.log ("SHOW RESULTS")
    this.parseDataForGraph()
    this.createGraph();
  }

  parseDataForGraph(){
    this._results.forEach(result => {
      const countryName = result["?countryName"]?.value;
      
      // Vérifie si le pays existe déjà dans listCountryData
      const country = this.listCountryData.find(item => item.Country === countryName);
      
      if (country) {
        // Si le pays existe, on incrémente sa valeur
        country.Value += 1;
      } else if (countryName) {
        // Si le pays n'existe pas, on l'ajoute avec une valeur par défaut (par exemple, 1)
        this.listCountryData.push({ Country: countryName, Value: 1 });
      }
    });
    // Tri de la liste par valeur décroissante et garde seulement les 20 premiers pays
    this.listCountryData = this.listCountryData
    .sort((a, b) => b.Value - a.Value)
    .slice(0, 10);  // Garde les 20 premiers éléments
    console.log(this.listCountryData)

  }

  queryRequestToData(n3Data: string,query: string) {
    const store = $rdf.graph(); // Create an RDF graph

    // Parse the Turtle data into the RDF graph
    $rdf.parse(n3Data, store, 'http://example.com/base', 'text/turtle');

    if(query == ""){
      // get the string query
      query = this.getQuery();
    }

    // Convert the SPARQL query string to a Query object
    const sparqlQuery = $rdf.SPARQLToQuery(query , false, store);

    //verif the query not empty
    if (!sparqlQuery) {
      console.error('Invalid SPARQL query.');
      return;
    }
    
    const results: any[] = [];
    store.query(sparqlQuery, function(result) {
      console.log('query ran');
      results.push(result);
     });

    this._results = results;
  }
  
  getQuery(): string {
    const query = `
    @base <https://cours.iut-orsay.fr/qar/> .
    PREFIX iut: <https://cours.iut-orsay.fr/qar/>
    PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>


    select ?countryName (COUNT(?disaster) AS ?nbPays) where {

    ?disaster rdf:type iut:NaturalDisaster;
    	        iut:occuredIn ?location .
    ?location iut:isInCountry ?country .
    ?country iut:countryName ?countryName .
    
    }
    GROUP BY ?country ?countryName
    ORDER BY DESC (?nbPays)
    LIMIT 10
    `;
    return query;
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
    .attr("style", "max-width: 100%; height: auto;");

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
    const container = d3.select("#chart").node() as HTMLElement | null;
    
    if (container) {
      // Append the SVG node to the container
      container.appendChild(svg.node()!);
    } else {
      console.error("Element with id 'chart' not found.");
    }
  }
}