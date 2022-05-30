import Render from "./Render.js";
import ItemManager from "./ItemManager.js";

class Main {
  constructor() {
    this.itemManager = new ItemManager();
    this.tasksList = [];
    this.render = new Render(
      this.itemManager.addItem.bind(this.itemManager),
      this.itemManager.removeItem.bind(this.itemManager),
      this.itemManager.getAllItems.bind(this.itemManager),
      this.itemManager.taskFinished.bind(this.itemManager)
    );
    this.localStorageName = "Todos";
    this.getFromLocalStorage();
  }

  init() {
      
    (this.tasksList).forEach(element => {
        console.log(element);
        this.render.addNewItem(this.render.buildNewItem(element.text, element.time, element.done, element.pokemonImage));
        // console.log(element.text);
    });
    this.render.init();
    const addButton = document.querySelector(".add-to-do-button");
    addButton.addEventListener("click", () => {
        console.log(addButton);
      this.render.addButtonClicked();
    });
  }

  getFromLocalStorage(){
    const getLocalStorage = localStorage.getItem(this.localStorageName);
    if(getLocalStorage === null){
        this.tasksList = [];
    }
    else{
        this.tasksList = JSON.parse(getLocalStorage);
    }
  }
}

const main = new Main();

document.addEventListener("DOMContentLoaded", function () {
  // you should create an `init` method in your class
  // the method should add the event listener to your "add" button
  main.init();
});