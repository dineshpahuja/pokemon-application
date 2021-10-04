import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PokemonDashboardComponent } from './modules/pokemon/components/pokemon-dashboard/pokemon-dashboard.component';
import { PokemonDetailsComponent } from './modules/pokemon/components/pokemon-details/pokemon-details.component';


const routes: Routes = [
  {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
  {path: 'dashboard', component: PokemonDashboardComponent},
  {path: 'details', component: PokemonDetailsComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
