import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Toaster } from 'ngx-toast-notifications';
import { PokemonDataModel, PokemonModel, QueryParamsModel } from 'src/app/modules/pokemon/Model/pokemon.model';
import { PokemonService } from '../../services/pokemon.service';

@Component({
  selector: 'app-pokemon-dashboard',
  templateUrl: './pokemon-dashboard.component.html',
  styleUrls: ['./pokemon-dashboard.component.css']
})
export class PokemonDashboardComponent implements OnInit {
  public pockemonPerPage = 10;
  public pockemonOffset = 0;
  public pokemonsData: PokemonDataModel;
  public pokemons: PokemonModel[] = [];
  public loading = true;
  public searchError = '';
  public pokemonDataSortBy = ''; 

  constructor(
    private readonly pokemonService: PokemonService,
    private readonly router: Router,
    private readonly toaster: Toaster,
  ) {
    this.pokemonService.searchPockemonEvent.subscribe((searchQueryPokemon) => this.searchPokemon(searchQueryPokemon));
  }

  ngOnInit(): void {
    this.getPockemonData();
  }

  private getPockemonData(url?:string) {
    const queryParams: QueryParamsModel = {
      limit: this.pockemonPerPage,
      offset: this.pockemonOffset,
    }
    this.pokemonService.getPockemonData(queryParams, url).subscribe(
      (response: PokemonDataModel) => {
        this.loading = false;
        if (response) {
          this.pokemonsData = response;
        }
      }
    );
  }

  private previousPage() {
    if (this.pokemonsData && this.pokemonsData?.previous !== null) {
      this.getPockemonData(this.pokemonsData.previous);
    } else{
     const errMsg = `previous page is not available`;
      this.toaster.open({
        text: errMsg ,
        type: 'danger',
      });
    }
  }
  private nextPage() {
    if (this.pokemonsData && this.pokemonsData?.next !== null) {
      this.getPockemonData(this.pokemonsData?.next);
    } else{
      const errMsg = `next page is not available`;
      this.toaster.open({
        text: errMsg ,
        type: 'danger',
      });
    }
  }

  public searchPokemon(searchQueryPokemon: string) {
    const reg = /^[a-z]+$/i;
    if (searchQueryPokemon.length >= 3 && reg.test(searchQueryPokemon)) {
        // use search API to see if pokemon Exists or not
        this.pokemonService.getSinglePokemonDetails(searchQueryPokemon.toLowerCase()).subscribe(
          (res: any) => {
          const searchedPokemon = this.pokemonsData.results.filter(ele => ele.name.toLowerCase() === searchQueryPokemon.toLowerCase());
          this.searchError = '';
          if(searchedPokemon) {
            this.router.navigate(['/details'], { state: { data: searchedPokemon[0] } });
          }
          },
          (error) => {
            this.searchError = `Pokemon Not Found by Name ${searchQueryPokemon}`;
            this.toaster.open({
              text: this.searchError ,
              type: 'danger',
            });
          });
    } else {
      this.searchError = 'Atleast 3 alphabets required';
      this.toaster.open({
        text: this.searchError ,
        type: 'danger',
      });
    }

  }

  public getSortedPockemonData(event: Event) {
    const key = event.target['value'].toLowerCase();
    const data =  this.pokemonsData.results.slice(); 
    switch (key) {
      case 'name':
        this.pokemonsData.results = this.getSortedData(data, 'name'); 
        break;
        case 'height':
        this.pokemonsData.results = this.getSortedData(data, 'height'); 
        break;
        case 'weight':
        this.pokemonsData.results = this.getSortedData(data, 'weight'); 
        break;
      default:
        this.pokemonsData.results = data;
        break;
    }
  }

  public getSortedData(data, sortBy) {
    return data.sort((a,b) => {
      return a[sortBy] < b[sortBy] ? -1 : 1;
    });
  }

  public getPaginatedPockemonData(event: Event) {
    this.pockemonPerPage = +event.target['value'];
    this.pockemonOffset = 0;
    // this.pokemons =  this.pokemons
    //  .slice((this.page - 1) * this.pockemonPerPage, (this.page - 1) * this.pockemonPerPage + this.pockemonPerPage);
     this.getPockemonData();
   }
}
