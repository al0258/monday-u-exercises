import PokemonClient from "./PokemonClient.js";
import * as fs from 'fs';

export default class ItemManager {
  constructor() {
    this.tasksList = [];
    this.pokemonClient = new PokemonClient();
    //this.getFromLocalStorage();
  }

  addNewTask(text) {
    if (text) {
      this.checkNewTaskInput(text);
    } else {
      return null;
    }
  }

  checkNewTaskInput(text) {
    const textList = text.split(",");
    if (textList.length > 1) {
      textList.forEach((text) => this.checkUserInput(text.trim()));
    } else {
      this.checkUserInput(text.trim());
    }
  }

  async checkUserInput(text) {
    const format = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

    if (!format.test(text)) {
      // this.addNewItem(text);
      if (this.checkIfItemExists(text)) {
        console.log('You are trying to add the same task again');
      } else {
        const item = await this.createItem(text);
        // console.log(item);
        this.addNewItem(item);
      }
    } else {
      console.log(
        "Please use letters and numbers only. Oh, and commas"
      );
    }
  }

  buildNewItem(text, pokemonImage) {
    const item = {
      text,
      pokemonImage: pokemonImage,
    };

    return item;
  }

  addNewItem(item) {
    // console.log(item);
    // const data = fs.readFileSync('tasks.json');
    // if (Object.entries(data).length !== 0){
    //   console.log('hi');
    //   this.tasksList = JSON.parse(data);
    // }
    // console.log(this.tasksList);
    this.getItemsFromJson();
    this.tasksList.push(item);
    console.log("New todo added successfully");
    // console.log(this.tasksList);
    this.writeToJson();
  }

  getItemsFromJson() {
    const data = fs.readFileSync('tasks.json');
    this.tasksList = JSON.parse(data);
    // console.log(this.tasksList);
}

  writeToJson() {
    const jsonContent = JSON.stringify(this.tasksList);
    // console.log(jsonContent);
    fs.writeFileSync("tasks.json", jsonContent, err => {
      if (err) {
        return console.log(err);
      }
    });
  }

  async createItem(text) {
    const isPokemonRegex = /^[0-9]*$/;
    if (isPokemonRegex.test(text)) {
      const pokemonId = parseInt(text);
      const pokemonName = await this.pokemonClient.fetchPokemonNameById(pokemonId);
      const pokemonImage = await this.pokemonClient.getPokemonImage(pokemonId);
      const item = this.buildNewItem(pokemonName, pokemonImage);
      return item
    } else {
      const pokemonName = await this.pokemonClient.fetchPokemonByName(text);

      if (pokemonName) {
        pokemonImage = await this.pokemonClient.getPokemonImageByName(text);
        const item = this.buildNewItem(pokemonName, pokemonImage);
        return item
      }
    }
    const item = this.buildNewItem(text,'');
    return item
  }

  checkIfItemExists(text) {
    this.getItemsFromJson();
    const isExists = this.tasksList.some((item) => item.text === text);

    // checks if task already exists
    return isExists;
  }

  removeItem(index) {
    this.tasksList.splice(index,1);
    this.writeToJson();
    console.log('Item Removed');
  }

  sortItems(){
    this.tasksList.sort((a,b) => a.text - b.text);
    this.writeToJson();
  }

  getAllItems() {
    return this.tasksList;
  }
}