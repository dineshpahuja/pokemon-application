import { Component } from '@angular/core';
import { PokemonService } from './modules/pokemon/services/pokemon.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public title = 'pokemon-application';
  public searchQueryPokemon = '';

  constructor(
    private readonly pokemonService: PokemonService,
  ) { }

  public searchPokemon() {
    this.pokemonService.searchPockemonEvent.emit(this.searchQueryPokemon);
  }
}
