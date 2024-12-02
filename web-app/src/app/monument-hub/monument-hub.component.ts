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

  constructor(private sharedService: SharedService) {}
  
  getText(): void {
    const textarea = document.getElementById('myTextarea') as HTMLTextAreaElement;
    if (textarea) {
      this.query = textarea.value;
    }
  }

  get data(): string {
    return this.sharedService.getData();
  }
  
  listCountry: string[] = ['USA', 'France', 'Germany', 'Canada']; // List of countries for the choice
  selectedCountry: string = ''; // Tracks the selected country
  showGraph: boolean = false; // Controls the visibility of the section

  private metric: string = "absolute"; // "absolute" or "percentage"
  private width: number = 800; // Chart width
  private states = [ //DATA
    { State: "Alabama", 2010: 100, 2019: 120 },
    { State: "Alaska", 2010: 80, 2019: 60 },
    { State: "Arizona", 2010: 90, 2019: 100 },
    { State: "California", 2010: 102, 2019: 95 },
    { State: "Texas", 2010: 78, 2019: 120 },
    { State: "New York", 2010: 89, 2019: 93 },
    { State: "Florida", 2010: 95, 2019: 110 },
    { State: "Georgia", 2010: 72, 2019: 85 },
    { State: "Illinois", 2010: 105, 2019: 112 }
    // Add more data as needed
  ];


  async onCountryChange() {
    this.showGraph = this.selectedCountry !== ''; // Show section if a country is selected
    if(this.showGraph){
      const n3Data = this.data
      this.getText();
      const results = this.queryRequestToData(n3Data,this.query)

      if (results){
        console.log("results")
        console.log(results["1"])
        console.log(results[1]["?disaster"])
        console.log("results")
      }
      //this.createGraph();
    }
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

    store.query(sparqlQuery, function(result) {
      console.log('query ran');
      console.log(result);
  });


    return [];
  }


  
  getQuery(): string {
    const query1 = `
    @base <https://cours.iut-orsay.fr/qar/> .
    PREFIX iut: <https://cours.iut-orsay.fr/qar/>
    PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

    select ?disaster where {

    ?disaster rdf:type iut:NaturalDisaster.
    
    }
    `;
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
    `;
    return query;
  }

 
  createGraph(): void { //D3 GRAPH
    const data = d3.sort(this.states, d => d[2019] - d[2010])
    .map(d => ({
      ...d,
      value: this.metric === "absolute" 
        ? d[2019] - d[2010] 
        : (d[2019] - d[2010]) / d[2010]
    }));

    const barHeight = 25;
    const marginTop = 30;
    const marginRight = 60;
    const marginBottom = 10;
    const marginLeft = 60;
    const height = Math.ceil((data.length + 0.1) * barHeight) + marginTop + marginBottom;

    const x = d3.scaleLinear()
      .domain(d3.extent(data, d => d.value) as [number, number])
      .rangeRound([marginLeft, this.width - marginRight]);

    const y = d3.scaleBand()
      .domain(data.map(d => d.State))
      .rangeRound([marginTop, height - marginBottom])
      .padding(0.1);

    const format = d3.format(this.metric === "absolute" ? "+,d" : "+.1%");
    const tickFormat = this.metric === "absolute" 
      ? d3.formatPrefix("+.1", 1e6) 
      : d3.format("+.0%");

    // Create an SVG element using d3.create()
    const svg = d3.create("svg")
      .attr("viewBox", `0 0 ${this.width} ${height}`)
      .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");

      console.log(svg)

    svg.append("g")
      .selectAll("rect")
      .data(data)
      .join("rect")
      .attr("fill", d => d3.schemeRdBu[3][d.value > 0 ? 2 : 0])
      .attr("x", d => x(Math.min(d.value, 0)))
      .attr("y", d => y(d.State)!)
      .attr("width", d => Math.abs(x(d.value) - x(0)))
      .attr("height", y.bandwidth());

    svg.append("g")
      .selectAll("text")
      .data(data)
      .join("text")
      .attr("text-anchor", d => (d.value < 0 ? "end" : "start"))
      .attr("x", d => x(d.value) + Math.sign(d.value - 0) * 4)
      .attr("y", d => y(d.State)! + y.bandwidth() / 2)
      .attr("dy", "0.35em")
      .text(d => format(d.value));

    svg.append("g")
      .attr("transform", `translate(0,${marginTop})`)
      .call(d3.axisTop(x).ticks(this.width / 80).tickFormat(tickFormat))
      .call(g => g.selectAll(".tick line").clone()
        .attr("y2", height - marginTop - marginBottom)
        .attr("stroke-opacity", 0.1))
      .call(g => g.select(".domain").remove());

    svg.append("g")
      .attr("transform", `translate(${x(0)},0)`)
      .call(d3.axisLeft(y).tickSize(0).tickPadding(6))
      .call(g => g.selectAll(".tick text")
        .filter((d, i) => data[i].value < 0)
        .attr("text-anchor", "start")
        .attr("x", 6));
    //D3 GRAPH FIN


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