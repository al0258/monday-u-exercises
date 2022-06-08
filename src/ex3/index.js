import ItemManager from "./ItemManager.js";
import PokemonClient from "./PokemonClient.js";
import * as fs from 'fs';

import chalk from "chalk";
import {
    Command
} from "commander";

class Main {
    constructor(itemManager, pokemonClient) {
        this.itemManager = itemManager;
        this.pokemonClient = pokemonClient;
        this.tasksList = []
        this.jsonFile = 'tasks.json';
    }

    getItemsFromJson() {
        try {
            if (fs.existsSync(this.jsonFile)) {
                const data = fs.readFileSync(this.jsonFile);
                this.tasksList = JSON.parse(data);
            }
        } catch (error) {
            console.log(chalk.bgRed.white('Cannot find file'));
        }

    }

    checkIfTasksExist() {
        this.getItemsFromJson();
        if (this.tasksList.length === 0) {
            console.log(chalk.bgRed.white("There are no tasks in your list"));
            return false;
        } else {
            return true;
        }
    }

    printTasks() {
        if (this.checkIfTasksExist()) {
            console.log(chalk.bgCyan.whiteBright("Getting all your todos"));
            this.tasksList.forEach((element, index) => {
                console.log(`Task ${index}: ${element.text}`);
            });
        }
    }

    printPokemonsCaught() {
        if (this.checkIfTasksExist()) {
            this.tasksList.forEach((element, index) => {
                if (element.pokemonImage !== '') {
                    console.log(`Task ${index}: ${element.text}`);
                    pokemonClient.displayPokemon(element.pokemonImage);
                }
            });
        }
    }

    deleteTodoTask(index) {
        try {
            this.itemManager.removeItem(index);
            console.log(chalk.bgYellow.black(`Task ${index} was deleted successfully`));
        } catch (error) {
            console.log("error");
        }

    }

    addTodo(text) {
        try {
            this.itemManager.addNewTask(text);
        } catch (error) {
            console.log(error);
        }

    }

    sortTodoList() {
        try {
            this.itemManager.sortItems();
            console.log("The list was sorted successfully");
        } catch (error) {
            console.log(error);
        }
    }
}

const itemManager = new ItemManager();
const pokemonClient = new PokemonClient();
const main = new Main(itemManager, pokemonClient);

// main.init();


const program = new Command();

program
    .name("Tasker")
    .description("This is the best task managment tool you will ever find. I can store Pokemons too :)")
    .version("1.0.0");

program
    .command("add")
    .description("Add task")
    .argument("<string>", "first operand")
    .action((todo) => {
        main.addTodo(todo);
    });

program
    .command("get")
    .description("Prints all the tasks without pokemon images")
    .action(() => {
        main.printTasks();
    });

program
    .command("show")
    .description("Shows all the pokemons caught")
    .action(() => {
        main.printPokemonsCaught();
    });

program
    .command("delete")
    .description("Delete a task from the todo list")
    .argument("<number>", "index in array")
    .action((index) => {
        main.deleteTodoTask(index);
    });

program
    .command("sort")
    .description("Sort the todo list")
    .action(() => {
        main.sortTodoList();
    });

program.parse();