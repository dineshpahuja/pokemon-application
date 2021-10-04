export interface PokemonResponseModel {
    count: number,
    next: string,
    previous: string,
    results: [
        name: string,
        url: string,
    ]
}

export interface QueryParamsModel {
    limit: number | string,
    offset: number | string,
}

export interface PokemonModel {
    id: number,
    img: string,
    name: string,
    height: number,
    weight: number,
    ablities: Array<any>,
    sprites: Object,
    stats: Array<any>,
    types: Array<any>,
}

export interface PokemonDataModel extends PokemonModel{
    next: string,
    previous: string,
    results: PokemonModel[]
}