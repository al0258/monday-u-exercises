import ItemManager from "./ItemManager.js";
import PokemonClient from "./PokemonClient.js";
import * as fs from 'fs';

class Main {
    constructor(itemManager, pokemonClient) {
        this.itemManager = itemManager;
        this.pokemonClient = pokemonClient;
        this.tasksList = []
    }

    getItemsFromJson() {
        const data = fs.readFileSync('tasks.json');
        this.tasksList = JSON.parse(data);
        // console.log(this.tasksList);
    }

    printTasks(){
        this.getItemsFromJson();
        this.tasksList.forEach(element => {
            console.log(element.text);
        });
    }

    deleteTodoTask(index) {
        this.updateTodos(this.itemManager.deleteItem(index));
    }

    addTodo(text) {
        this.itemManager.addNewTask(text);
        // this.getItemsFromJson();
    }

    onSortListButtonClicked() {
        this.updateTodos(this.itemManager.sortItems());
    }
}

const itemManager = new ItemManager();
const pokemonClient = new PokemonClient();
const main = new Main(itemManager, pokemonClient);

// main.init();


import chalk from "chalk";
import {
    Command
} from "commander";
const program = new Command();

program
    .name("cli-calc")
    .description("The best CLI calculator")
    .version("1.0.0");

// program
//   .command("add")
//   .description("Add two numbers")
//   .argument("<string>", "first operand")
// //   .option("-c, --color <string>", "Result color", "white")
// //   .action((firstNumber, secondNumber, options) => {
//     .action((todo) => {
//     console.log(
//       chalk[options.color](
//         `Result: ${Number(firstNumber) + Number(secondNumber)}`
//       )
//     );
//   });

program
    .command("add")
    .description("Add task")
    .argument("<string>", "first operand")
    .action((todo) => {
        main.addTodo(todo);
    });

program
.command("get")
.description("Prints all the tasks")
.action(() => {
    main.printTasks();
});

program.parse();