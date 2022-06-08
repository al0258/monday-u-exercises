import fetch from "node-fetch";
import asciify from 'asciify-image';

export default class PokemonClient {
  constructor() {
    this.API_BASE = "https://pokeapi.co/api/v2";
    this.pokemonList = [];
    this.putPokemonsInArray();
  }

  async fetchAllPokemons() {
    try {
      const pokemons = await fetch(
        `${this.API_BASE}/pokemon?limit=100000&offset=0`
      );
      const pokemonsJson = await pokemons.json();

      return pokemonsJson.results;
    } catch {
      (err) => console.log(err);
    }
  }

  async putPokemonsInArray() {
    this.pokemonList = await this.fetchAllPokemons();
  }

  async displayPokemon(imageUrl){
    console.log(await asciify(imageUrl, { fit: "box", width: 20, height: 20, alphabet: "blocks" }));
  }

  async getPokemonImage(pokemonId) {
    try {
      const pokemonData = await this.getPokemon(pokemonId);
      return pokemonData.sprites.front_default;
    } catch (error) {
      return '';
    }
  }

  async getPokemonImageByName(name) {
    try {
      const pokemonId = this.pokemonList.findIndex(pokemon => pokemon.name === name);
      const pokemonImage = await this.getPokemonImage(pokemonId);
      return pokemonImage
    } catch (error) {
      console.log(error);
    }
  }

  async getPokemon(pokemonID) {
    try {
      if (pokemonID !== -1) {
        const response = await fetch(this.API_BASE + '/pokemon/' + pokemonID);
        const data = await response.json();
        console.log(data);
        return data;
      } else {
        return null;
      }
    } catch (error) {
      console.error(error);
    }
  }

  async fetchPokemonNameById(id) {
    try {
      // console.log(this.pokemonList);
      await this.putPokemonsInArray();
      const morePokemonData = await this.getPokemon(id);
      const pokemonType = morePokemonData.types[0].type.name;

      if (this.pokemonList[id].name) {
        return `Catch ${this.pokemonList[id].name} the ${pokemonType} type pokemon`;
      } else {
        return `Faild to fetch Pokemon with ID ${id}`;
      }
    } catch (err) {
      console.log(err);
      //(err) => console.log();
    }

    return `Failed to fetch Pokemon with ID ${id}`;
  }

  async fetchPokemonByName(name) {
    try {
      // const pokemonsList = await this.fetchAllPokemons();
      //const pokepok = this.pokemonList.find((pokemon) => pokemon.name.toLowerCase() === name.toLowerCase());
      await this.putPokemonsInArray();
      const pokemonId = this.pokemonList.findIndex(pokemon => pokemon.name === name);
      const morePokemonData = await this.getPokemon(pokemonId);
      // console.log(morePokemonData);
      const pokemonType = morePokemonData.types[0].type.name;
      const pokemonName = this.pokemonList.find((pokemon) => pokemon.name.toLowerCase() === name.toLowerCase()).name;
      //console.log(pokemonName);
      return `Catch ${pokemonName} the ${pokemonType} type pokemon`;
    } catch {
      return false;
    }
  }
}