import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PokemonModel } from '../../Model/pokemon.model';
import { PokemonProfileModel } from '../../Model/pokemonProfile.model';
import { PokemonService } from '../../services/pokemon.service';

@Component({
  selector: 'app-pokemon-details',
  templateUrl: './pokemon-details.component.html',
  styleUrls: ['./pokemon-details.component.css']
})
export class PokemonDetailsComponent implements OnInit {
  public pokemonProfile = {} as PokemonProfileModel;
  public loading = true;
  private pokemonData: PokemonModel;
  constructor(
    private readonly pokemonService: PokemonService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly location: Location
  ) { }

  ngOnInit(): void {
    console.log(this.location.getState());
    this.pokemonData = this.location.getState()['data'];
    if (this.pokemonData) {
      this.loading = false;
      this.getPokemonDetails();
    }
  }

  public getPokemonDetails() {
    this.pokemonProfile.height = this.pokemonData.height;
    this.pokemonProfile.weight = this.pokemonData.weight;
    this.pokemonProfile.id = this.pokemonData.id;
    this.pokemonProfile.name = this.pokemonData.name; // or this.pokemonData.name
    this.pokemonProfile.evolution = [];
    this.pokemonProfile.mainPokemonAvatar = this.pokemonData.sprites['front_default'];
    this.pokemonProfile.hp = this.pokemonData.stats[0].base_stat;
    this.pokemonProfile.attack = this.pokemonData.stats[1].base_stat;
    this.pokemonProfile.defense = this.pokemonData.stats[2].base_stat;
    this.pokemonProfile.specialAttack = this.pokemonData.stats[3].base_stat;
    this.pokemonProfile.specialDefense = this.pokemonData.stats[4].base_stat;
    this.pokemonProfile.speed = this.pokemonData.stats[5].base_stat;
    this.pokemonProfile.types = [];
    this.pokemonData.types.forEach(element => {
      this.pokemonProfile.types.push(element.type.name);
    });

    const tempArr = [];

    this.pokemonData.ablities.forEach(element => {
      tempArr.push(element.ability.name);
    });
    this.pokemonProfile.abilities = tempArr.join(',');

    // this is for gender , abilities ,and  others
    this.pokemonService.getPockemonDetails(this.pokemonData.name).subscribe((res: any) => {
      this.pokemonProfile.catchRate = res.capture_rate;
      this.pokemonProfile.hatchSteps = res.hatch_counter;
      this.pokemonProfile.color = res.color.name;
      this.pokemonProfile.evolutionChain = res.evolution_chain.url; //use this URL to get entire evolution chain
      this.pokemonProfile.eggGroups = '';
      res.egg_groups.forEach(element => {
        this.pokemonProfile.eggGroups = this.pokemonProfile.eggGroups + element.name + ',';
      });
      this.getPokemonEvolutionDetails(this.pokemonProfile.evolutionChain);
    });

  }

  public getPokemonEvolutionDetails(url: string) {
    this.pokemonService.getEvolution(this.pokemonProfile.evolutionChain).subscribe((res: any) => {
      var evoChain = [];
      var evoData = res.chain;
      do {
        var evoDetails = evoData['evolution_details'][0];
        evoChain.push({
          "species_name": evoData.species.name,
          "min_level": !evoDetails ? 1 : evoDetails.min_level,
        });

        evoData = evoData['evolves_to'][0];
      } while (!!evoData && evoData.hasOwnProperty('evolves_to'));
      let currentPokemonIndexInEvoltionChain = evoChain.findIndex(element => element.species_name === this.pokemonProfile.name);
      if (currentPokemonIndexInEvoltionChain !== (evoChain.length - 1)) {
        let nextPokemonIndexInEvolutionChain = currentPokemonIndexInEvoltionChain+1;
        this.pokemonProfile.evolution.push(evoChain[nextPokemonIndexInEvolutionChain]); // This array contains evolution
        // this.searchPokemon(evoChain[nextPokemonIndexInEvolutionChain].species_name); // to do handle super form
      }

    });
  }

  public onPreviousPageCick(){
    this.router.navigate(['/dashboard']);
  }

}
