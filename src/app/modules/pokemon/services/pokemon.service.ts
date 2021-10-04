import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { pokemonServiceConstants } from '../constants/pokemon.constants';
import { forkJoin, Observable, of, throwError } from 'rxjs';
import { PokemonDataModel, PokemonModel, PokemonResponseModel, QueryParamsModel } from '../Model/pokemon.model';
import { interval, fromEvent } from 'rxjs';
import { map, mergeMap, switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PokemonService {
  public pokemon: PokemonModel;
  public searchPockemonEvent = new EventEmitter<string>();

  constructor(private httpClient: HttpClient) { }

  public fetchPockemonData(queryParams: QueryParamsModel, url = pokemonServiceConstants.url): Observable<PokemonResponseModel> {
    let params = new HttpParams();
    params = params.append('limit', queryParams?.limit as string);
    params = params.append('offset', queryParams?.offset as string);
    const options = {
      ...params
    }
    return this.httpClient.get<PokemonResponseModel>(url, options);
  }

  public getIndividualPockemonData(url: string) {
    return this.httpClient.get<any>(url);
  }

  public getPockemonData(queryParams: QueryParamsModel, url?:string): Observable<any> {
    return this.fetchPockemonData(queryParams, url).pipe(
      map((res: PokemonResponseModel) => res),
      mergeMap((res) => {
        if (res) {
          const tasksObservables = res?.results.map((result) => this.getIndividualPockemonData(result['url']));
          return forkJoin(tasksObservables).pipe(map(pokemons => {
            return {
              next: res.next,
              previous: res.previous,
              results: this.deserializePokemonResponse(pokemons)
            };
          }));
        }
      })
    );
  }

  public deserializePokemonResponse(pokemons): PokemonModel[] {
    return pokemons.map(element => {
      return {
        img: element?.sprites?.other?.['official-artwork']?.front_default,
        name: element?.name,
        height: element?.height,
        weight: element?.weight,
        ablities: element?.abilities,
        id: element?.id,
        sprites: element?.sprites,
        stats: element?.stats,
        types: element?.types,
      } as PokemonModel;
    });
  }
  
  /**
   * Method is used to getPockemonDetails 
   * @param name
   * @returns observable data for specific pokemon-species
   */
  public getPockemonDetails(name: string) {
    return this.httpClient.get(`https://pokeapi.co/api/v2/pokemon-species/${name}/`);
  }

  /**
   * Method used to getEvolution
   * @param myUrl
   * @returns observable data for specific url data
   */
  public getEvolution(myUrl: string) {
    return this.httpClient.get(myUrl);
  }
 
   /**
    * Method getSinglePokemonDetails is used to search and find evolved pokemon pic
    * @param pokemonName
    * @returns single specific pockemen
    */
  public getSinglePokemonDetails(pokemonName: string){
    return this.httpClient.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
  }

  private handleerror(error: Error) {
    console.error(error.name + ' - Data not found with message: ' + error.message);
    return throwError(error || 'Server error');
  }
  
  public getSearch
}


