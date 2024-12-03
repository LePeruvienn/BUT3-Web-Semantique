import { Component, } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { HttpClientModule, HttpClient } from '@angular/common/http'; // Import HttpClientModule
import * as d3 from 'd3';
import { ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-monument-hub',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule], 
  templateUrl: './monument-hub.component.html',
  styleUrls: ['./monument-hub.component.css'],
})


export class MonumentHubComponent{
  customQuery: string = ``;
   data: Array<any> = []; // Array of objects for tab content
  activeTabIndex: number = 0;

  setActiveTab(index: number): void {
    this.activeTabIndex = index;
  }
    
  listData : any[]= [];
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

  constructor(private http: HttpClient) {}

  LoadData() {
    console.log ("SHOW RESULTS")
    this.queryRequestToGraphDB()
  }

  queryRequestToGraphDB(): void {
    const endpointUrl = 'http://localhost:7200/repositories/ProjectS5';
    const sparqlQuery = this.customQuery;
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
        

        const table = document.createElement("table");      
        table.className = "professional-table"; 

        data.results.bindings[0];

        let listName = [];
        
        const title = table.insertRow();
        for(const i in data.results.bindings[0]){
          listName.push(i);

          const cell2 = title.insertCell();
          cell2.textContent = i;
        }

        data.results.bindings.forEach((val: any) => {
            const row = table.insertRow();
            
            listName.forEach(name => {
              const cell2 = row.insertCell();

              const value = val[name].value; // Assuming value is a string
              if (!isNaN(Number(value))) {
                  val[name].value = Number(value).toFixed(4).toString(); 
              }
              cell2.textContent = val[name].value;
              console.log(val[name].value)
            })
        });

        document.body.appendChild(table);
          const container = d3.select("#chart").node() as HTMLElement | null;
          if (container) {
            container.innerHTML = "";
            container.appendChild(table);
          } else {
            console.error("Element with id 'chart' not found.");
          }
      },
      error => {
        console.error('Error fetching data from GraphDB:', error);
      }
    );
  }
}