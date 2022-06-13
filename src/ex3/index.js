#!/usr/bin/env node

import ItemManager from "./ItemManager.js";
import PokemonClient from "./PokemonClient.js";
import Main from "./Main.js"
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

const CONSOLE_ACTIONS = {
    ADD_TASK: 'Add a task',
    GET_TASKS: 'Get all tasks',
    SHOW_POKEMONS: 'Show pokemons',
    DELETE_TASK: 'Delete task',
    SORT_LIST: 'Sort the task list',
    EXIT: 'Exit'
  }

const itemManager = new ItemManager();
const pokemonClient = new PokemonClient();
const main = new Main(itemManager, pokemonClient);



// This is the inquirer start
// Comment this part and uncomment the next part to see the command tool


const sleep = (ms = 1000) => new Promise((r) => setTimeout(r, ms));

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
            CONSOLE_ACTIONS.ADD_TASK,
            CONSOLE_ACTIONS.GET_TASKS,
            CONSOLE_ACTIONS.SHOW_POKEMONS,
            CONSOLE_ACTIONS.DELETE_TASK,
            CONSOLE_ACTIONS.SORT_LIST,
            CONSOLE_ACTIONS.EXIT
        ]
    });
    return handleAnswer(answer.commands);
}

async function handleAnswer(option) {
    console.log(option);
    const spinner = createSpinner('Doin stuff in the meantime look at this cool animation').start();
    await sleep();

    switch (option) {
        case CONSOLE_ACTIONS.ADD_TASK:
            spinner.success();
            const taskToAdd = await inquirer.prompt({
                name: 'add',
                type: 'input',
                message: 'Write the new task to add to the list'
            });

            await main.addTodo(taskToAdd.add);

            startCommands();
            break;
        case CONSOLE_ACTIONS.GET_TASKS:
            spinner.success();
            main.printTasks();
            console.log();

            startCommands();
            break;
        case CONSOLE_ACTIONS.SHOW_POKEMONS:
            spinner.success();
            main.printPokemonsCaught();

            await sleep();
            startCommands();
            break;
        case CONSOLE_ACTIONS.DELETE_TASK:
            spinner.success();
            const itemToDelete = await inquirer.prompt({
                name: 'delete',
                type: 'input',
                message: 'Write the index of the task you want to delete'
            });

            main.deleteTodoTask(itemToDelete.delete);

            startCommands();
            break;
        case CONSOLE_ACTIONS.SORT_LIST:
            spinner.success();
            main.sortTodoList();

            startCommands();
            break;

        case CONSOLE_ACTIONS.EXIT:
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





// This is the command part


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