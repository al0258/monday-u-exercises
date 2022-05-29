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
      } 
      catch {
        (err) => console.log(err);
      }
    }

    async putPokemonsInArray(){
      this.pokemonList = await this.fetchAllPokemons();
    }

    async getPokemon(pokemonID) {
      try {
         const response = await fetch(this.API_BASE + '/pokemon/' + pokemonID);
         const data = await response.json();

         return data;
      } catch (error) {
         console.error(error);
      }
   }
  
    async fetchPokemonNameById(id) {
      try {
        const morePokemonData = await this.getPokemon(id);
        const pokemonType = morePokemonData.types[0].type.name;

        if (this.pokemonList[id].name) {
          return `Catch ${this.pokemonList[id].name} the ${pokemonType} type pokemon`;
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
          // const pokemonsList = await this.fetchAllPokemons();
          const pokemonName = this.pokemonList.find((pokemon) => pokemon.name.toLowerCase() === name.toLowerCase()).name;
          return `Catch ${pokemonName}`;
        } catch {
          return false;
        }
      }
    }