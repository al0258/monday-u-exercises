import fetch from "node-fetch";
import asciify from 'asciify-image';

export default class PokemonClient {
  constructor() {
    this.API_BASE = "https://pokeapi.co/api/v2";
  }

  async displayPokemon(imageUrl){
    console.log(await asciify(imageUrl, { fit: "box", width: 20, height: 20 }));
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
      const pokemonData = await this.getPokemonWithName(name);
      const pokemonImage = pokemonData.sprites.front_default;
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
        return data;
      } else {
        return null;
      }
    } catch (error) {
      console.error(error);
    }
  }

  async getPokemonWithName(name) {
    try {
      if (name!='') {
        const response = await fetch(this.API_BASE + '/pokemon/' + name);
        const data = await response.json();
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
      const pokemonData = await this.getPokemon(id);
      const pokemonName = pokemonData.name;
      const pokemonType = pokemonData.types[0].type.name;

      if (pokemonData) {
        return `Catch ${pokemonName} the ${pokemonType} type pokemon`;
      } else {
        return `Faild to fetch Pokemon with ID ${id}`;
      }
    } catch (err) {
      console.log(err);
    }

    return `Failed to fetch Pokemon with ID ${id}`;
  }

  async fetchPokemonByName(name) {
    try {
      const morePokemonData = await this.getPokemonWithName(name);
      const pokemonType = morePokemonData.types[0].type.name;
      return `Catch ${name} the ${pokemonType} type pokemon`;
    } catch {
      return false;
    }
  }
}