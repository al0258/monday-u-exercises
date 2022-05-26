import Render from "./Render.js";
import ItemManager from "./ItemManager.js";

class Main {
  constructor() {
    this.itemManager = new ItemManager();
    this.render = new Render(
      this.itemManager.addItem.bind(this.itemManager),
      this.itemManager.removeItem.bind(this.itemManager),
      this.itemManager.getAllItems.bind(this.itemManager)
    );
  }

  init() {
    this.render.init();
    //const addButton = document.getElementById("add-todo");
    const addButton = document.querySelector(".add-to-do-button");
    addButton.addEventListener("click", () => {
        console.log(addButton);
      this.render.addButtonClicked();
    });
  }
}

const main = new Main();

document.addEventListener("DOMContentLoaded", function () {
  // you should create an `init` method in your class
  // the method should add the event listener to your "add" button
  main.init();
});