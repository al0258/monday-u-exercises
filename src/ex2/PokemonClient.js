export default class PokemonClient {
    constructor() {
      this.API_BASE = "https://pokeapi.co/api/v2";
    }
  
    async fetchAllPokemons() {
      try {
        const pokemons = await fetch(
          `${this.API_BASE}/pokemon?limit=100000&offset=0`
        );
        const pokemonsJson = await pokemons.json();
  
        return pokemonsJson.results;
      } 
      catch {
        (err) => console.log(err);
      }
    }
  
    async fetchPokemonNameById(id) {
      try {
        const pokemonsList = await this.fetchAllPokemons();

        if (pokemonsList[id].name) {
          return `Catch ${pokemonsList[id].name}`;
        } 
        else {
          return `Faild to fetch Pokemon with ID ${id}`;
        }
      } 
      catch (err) {
        console.log(err);
        //(err) => console.log();
      }
  
      return `Failed to fetch Pokemon with ID ${id}`;
    }

    async fetchPokemonByName(name) {
        try {
          const pokemonsList = await this.fetchAllPokemons();
          const pokemonName = pokemonsList.find(
            (pokemon) => pokemon.name.toLowerCase() === name.toLowerCase()
          ).name;
          return `Catch ${pokemonName}`;
        } catch {
          return false;
        }
      }
    }