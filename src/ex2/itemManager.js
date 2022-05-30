import PokemonClient from "./PokemonClient.js";

export default class ItemManager {
  constructor() {
    this.tasksList = [];
    this.pokemonClient = new PokemonClient();
    this.alertBox = document.querySelector(".alert");
    this.alertBoxText = document.querySelector(".alert-inner-text");
    this.localStorageName = "Todos";
    //this.getFromLocalStorage();
  }

  async addItem(item) {
    const isPokemonRegex = /^[0-9]*$/;
    if (isPokemonRegex.test(item.text)) {
      const pokemonId = parseInt(item.text);
      const pokemonName = await this.pokemonClient.fetchPokemonNameById(pokemonId);
      item.pokemonImage=await this.pokemonClient.getPokemonImage(pokemonId);
      item.text = pokemonName;
    } 
    else {
      const pokemonName = await this.pokemonClient.fetchPokemonByName(item.text);

      if (pokemonName) {
        item.text = pokemonName;
        console.log(pokemonName);
      }
    }
    if (!this.checkIfItemExists(item.text)){
      this.tasksList.push(item);
      this.updateLocalStorage();
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

  updateLocalStorage(){
    localStorage.setItem(this.localStorageName, JSON.stringify(this.tasksList));
  }

  // getFromLocalStorage(){
  //   const getLocalStorage = localStorage.getItem(this.localStorageName);
  //   if(getLocalStorage === null){
  //       this.tasksList = [];
  //   }
  //   else{
  //       this.tasksList = JSON.parse(getLocalStorage);
  //   }
  // }

  removeItem(text) {
    console.log(text);
    this.tasksList = this.tasksList.filter((item) => item.text !== text);
    this.updateLocalStorage();
  }

  taskFinished(text){
    const index = this.tasksList.findIndex(item => item.text === text);
    this.tasksList[index].done = !this.tasksList[index].done;
    this.updateLocalStorage();
    console.log(this.tasksList[index]);
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