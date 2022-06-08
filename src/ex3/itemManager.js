import PokemonClient from "./PokemonClient.js";
import * as fs from 'fs';
import chalk from "chalk";

export default class ItemManager {
  constructor() {
    this.tasksList = [];
    this.pokemonClient = new PokemonClient();
    this.jsonFile = 'tasks.json';
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
      const item = await this.createItem(text);
      if (this.checkIfItemExists(item.text)) {
        console.log('You are trying to add the same task again');
      } else {
        // const item = await this.createItem(text);
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
    this.getItemsFromJson();
    this.tasksList.push(item);
    this.writeToJson();
    console.log(chalk.bgBlueBright.whiteBright(`${item.text} was added to the task list`));
  }

  getItemsFromJson() {
    if (fs.existsSync(this.jsonFile)) {
      const data = fs.readFileSync(this.jsonFile);
      this.tasksList = JSON.parse(data);
    }
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
      console.log(chalk.bgWhiteBright.red('A wild pokemon appeard...'));
      const item = this.buildNewItem(pokemonName, pokemonImage);
      return item
    } else {
      const pokemonName = await this.pokemonClient.fetchPokemonByName(text);

      if (pokemonName) {
        const pokemonImage = await this.pokemonClient.getPokemonImageByName(text);
        const item = this.buildNewItem(pokemonName, pokemonImage);
        return item
      }
    }
    const item = this.buildNewItem(text, '');
    return item
  }

  checkIfItemExists(text) {
    this.getItemsFromJson();
    const isExists = this.tasksList.some((item) => item.text === text);

    // checks if task already exists
    return isExists;
  }

  removeItem(index) {
    this.getItemsFromJson();
    this.tasksList.splice(index, 1);
    this.writeToJson();
  }

  sortItems() {
    this.getItemsFromJson();
    this.tasksList.sort((a, b) => {
      let taskOne = a.text.toLowerCase(),
        taskTwo = b.text.toLowerCase();

      if (taskOne < taskTwo) {
        return -1;
      }
      if (taskOne > taskTwo) {
        return 1;
      }
      return 0;
    });
    this.writeToJson();
  }

  getAllItems() {
    return this.tasksList;
  }
}