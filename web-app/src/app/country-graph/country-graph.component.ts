import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-country-graph',
  standalone: true,
  imports: [],
  templateUrl: './country-graph.component.html',
  styleUrl: './country-graph.component.css'
})
export class CountryGraphComponent {
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('ID:', id);
  }
}

