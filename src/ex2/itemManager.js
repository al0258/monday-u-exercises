import PokemonClient from "./PokemonClient.js";

export default class ItemManager {
  constructor() {
    this.tasksList = [];
    this.pokemonClient = new PokemonClient();
    this.alertBox = document.querySelector(".alert");
    this.alertBoxText = document.querySelector(".alert-inner-text");
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
    if (!this.checkIfItemExists(item.text)){
      this.tasksList.push(item);
      return item.text;
    }
    
    return "it exists";
  }

  checkIfItemExists(text){
    const isExists = this.tasksList.some((item) => item.text === text);

        // checks if task already exists
        if (isExists) {
            this.alert(`You are trying to add ${text} again`, "warning");
        }
        return isExists;
  }

  removeItem(text) {
    console.log(text);
    this.tasksList = this.tasksList.filter((item) => item.text !== text);
  }

  getAllItems() {
    return this.tasksList;
  }

  alert(alert, type) {
    if (!alert) {
      this.alertBox.classList.add("show", "warning");
      this.alertBoxText.innerText =
        "please write some text before adding new ToDo";
    } else {
      this.alertBox.classList.add("show", type);
      this.alertBoxText.innerHTML = alert;
    }
  }
}