import { Component,inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {
  router = inject(Router)

  private data: string = 'feur';

  getData(): string {
    return this.data;
  }


  NaviagatetoMonument(){
    this.router.navigate(['/monument-hub'])
  }
}
