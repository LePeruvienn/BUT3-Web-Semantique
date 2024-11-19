import { Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { MonumentHubComponent } from './monument-hub/monument-hub.component';

export const routes: Routes = [
    { path: '', component: AboutComponent },
    { path: 'monument-hub', component: MonumentHubComponent },
];

export class AppRoutingModule {}