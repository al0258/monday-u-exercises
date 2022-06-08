#!/usr/bin/env node

import ItemManager from "./ItemManager.js";
import PokemonClient from "./PokemonClient.js";
import * as fs from 'fs';


import chalk from "chalk";
import chalkanimation from "chalk-animation";
import inquirer from "inquirer";
import {
    Command
} from "commander";
import {
    createSpinner
} from "nanospinner";

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

const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));

async function welcome() {
    const rainbowTitle = chalkanimation.rainbow(
        'Welcome to the best cli task list out there (probably)'
    );

    await sleep();

    rainbowTitle.stop();

    console.log(`
    ${chalk.bgBlue('This is the best task managment tool you will ever find. I can store Pokemons too :)')}

    `);
}

async function startCommands() {
    const answer = await inquirer.prompt({
        name: 'commands',
        type: 'list',
        message: 'Pick an option',
        choices: [
            'Add a task',
            'Get all tasks',
            'Show pokemons',
            'Delete task',
            'Sort the task list',
            'Exit'
        ]
    });
    return handleAnswer(answer.commands);
}

async function handleAnswer(option) {
    console.log(option);
    const spinner = createSpinner('Doin stuff in the meantime look at this cool animation').start();
    await sleep();

    switch (option) {
        case 'Add a task':
            spinner.success();
            const taskToAdd = await inquirer.prompt({
                name: 'add',
                type: 'input',
                message: 'Write the new task to add to the list'
            });

            main.addTodo(taskToAdd.add);
            await sleep();

            startCommands();
            break;
        case 'Get all tasks':
            spinner.success();
            main.printTasks();

            await sleep();
            startCommands();
            break;
        case 'Show pokemons':
            spinner.success();
            main.printPokemonsCaught();

            await sleep();
            startCommands();
            break;
        case 'Delete task':
            spinner.success();
            const itemToDelete = await inquirer.prompt({
                name: 'delete',
                type: 'input',
                message: 'Write the index of the task you want to delete'
            });

            main.deleteTodoTask(itemToDelete.delete);

            await sleep();
            startCommands();
            break;
        case 'Sort the task list':
            spinner.success();
            main.sortTodoList();

            await sleep();
            startCommands();
            break;

            case 'Exit':
            spinner.success();
            process.exit(0);
            break;

        default:
            spinner.error("Pick something you fool");
            process.exit(1);
            // console.log("Pick something you fool");
            break;
    }
}

await welcome();
await startCommands();



// main.init();


// const program = new Command();

// program
//     .name("Tasker")
//     .description("This is the best task managment tool you will ever find. I can store Pokemons too :)")
//     .version("1.0.0");

// program
//     .command("add")
//     .description("Add task")
//     .argument("<string>", "first operand")
//     .action((todo) => {
//         main.addTodo(todo);
//     });

// program
//     .command("get")
//     .description("Prints all the tasks without pokemon images")
//     .action(() => {
//         main.printTasks();
//     });

// program
//     .command("show")
//     .description("Shows all the pokemons caught")
//     .action(() => {
//         main.printPokemonsCaught();
//     });

// program
//     .command("delete")
//     .description("Delete a task from the todo list")
//     .argument("<number>", "index in array")
//     .action((index) => {
//         main.deleteTodoTask(index);
//     });

// program
//     .command("sort")
//     .description("Sort the todo list")
//     .action(() => {
//         main.sortTodoList();
//     });

// program.parse();