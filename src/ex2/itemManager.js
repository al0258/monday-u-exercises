import PokemonClient from "./PokemonClient.js";

export default class ItemManager {
  constructor() {
    this.tasksList = [];
    this.pokemonClient = new PokemonClient();
  }

  async addItem(item) {
    const isPokemonRegex = /^[0-9]*$/;
    if (isPokemonRegex.test(item.text)) {
      const pokemonId = parseInt(item.text);
      const pokemonName = await this.pokemonClient.fetchPokemonNameById(pokemonId);
      item.text = pokemonName;
    } 
    else {
      const pokemonName = await this.pokemonClient.fetchPokemonByName(item.text);

      if (pokemonName) {
        item.text = pokemonName;
      }
    }
    this.tasksList.push(item);
    return item.text;
  }

  removeItem(text) {
    this.tasksList = this.tasksList.filter((item) => item.text !== text);
  }

  getAllItems() {
    return this.tasksList;
  }
}