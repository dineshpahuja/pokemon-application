import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokemonComponent } from './components/pokemon/pokemon.component';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { AlertModule } from 'ngx-bootstrap/alert';
import { PokemonDashboardComponent } from './components/pokemon-dashboard/pokemon-dashboard.component';
import { PokemonDetailsComponent } from './components/pokemon-details/pokemon-details.component';
import { ToastNotificationsModule } from 'ngx-toast-notifications';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  declarations: [
    PokemonComponent,
    PokemonDashboardComponent,
    PokemonDetailsComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    NgbModule,
    BrowserAnimationsModule,
    ProgressbarModule.forRoot(),
    AlertModule.forRoot(),
    ToastNotificationsModule,
  ],
  exports: [
    PokemonComponent,
    PokemonDashboardComponent,
    PokemonDetailsComponent,
  ]
})
export class PokemonModule { }
