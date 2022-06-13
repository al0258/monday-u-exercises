import chalk from "chalk";
import * as fs from 'fs';
export default class Main {
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
                    this.pokemonClient.displayPokemon(element.pokemonImage);
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

    async addTodo(text) {
        try {
            await this.itemManager.addNewTask(text);
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