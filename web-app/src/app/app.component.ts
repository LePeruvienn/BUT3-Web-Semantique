import { Component,inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MonumentHubComponent } from './monument-hub/monument-hub.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'web-app-Maxence-Arthur';
}
