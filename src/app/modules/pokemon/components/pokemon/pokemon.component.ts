import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PokemonModel } from 'src/app/modules/pokemon/Model/pokemon.model';

@Component({
  selector: 'app-pokemon',
  templateUrl: './pokemon.component.html',
  styleUrls: ['./pokemon.component.css']
})
export class PokemonComponent implements OnInit {
  public pockemonPerPage = 10;
  public pockemonOffset = 0;
  public page = 1;
  public pageSize = 4;
  public collectionSize = 0;
  public paginatePokemonData: PokemonModel[] = [];
  public loading = true;

  @Input() pokemonsData: PokemonModel[];

  constructor(private readonly router: Router) { }

  ngOnInit(): void {
  }

  private showPokemonDetails(pokemon: PokemonModel) {
    this.router.navigate(['/details'], { state: { data: pokemon } });
  }
}


