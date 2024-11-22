import { Component, inject, OnInit, ElementRef  } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { Router } from '@angular/router';
import * as d3 from 'd3';


@Component({
  selector: 'app-monument-hub',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './monument-hub.component.html',
  styleUrls: ['./monument-hub.component.css'],
})
export class MonumentHubComponent {
  listCountry: string[] = ['USA', 'France', 'Germany', 'Canada']; // List of countries
  selectedCountry: string = ''; // Tracks the selected country
  showGraph: boolean = false; // Controls the visibility of the section
  data = [30, 80, 45, 60, 20, 90, 55];
  constructor(private el: ElementRef) { }

  ngOnInit(): void {
    this.createGraph();
  } 
  
  onCountryChange() {
    this.showGraph = this.selectedCountry !== ''; // Show section if a country is selected
  }

  private createGraph(): void {
   
  }
}
