// The ItemManager should go here. Remember that you have to export it.

import FileSystemManager from "./file-system-manager.js";
import PokemonClient from "../clients/pokemon_client.js";
import { generateUniqueID, capitalizeText } from "../../utils/string-utils.js";

const TODO_MASSAGES = {
    POKEMON_NOT_FOUND: 'pokemonNotFound',
    TEXT: 'text',
    POKEMON: 'pokemon'
  }

export default class ItemManager {
    constructor() {
        this.pokemonClient = new PokemonClient;
        this.fileSystemManager = new FileSystemManager;
    }

    async addItem(value) {
        const items = value
            .split(',')
            .map(s => s.trim())
            .filter(Boolean);
        return Promise.all(items.map(item => this._handleItem(item)));
    }

    editItem(id, item) {
        const newItem = this.fileSystemManager.editItem(id, item);
        return newItem;
    }

    getItem(item) {
        return this.fileSystemManager.getItemFromFileById(item);
    }

    getAllItems(sortOrder) {
        return this.sortTasks(sortOrder);
    }

    getItemsLength() {
        return this.fileSystemManager.getAllItems()?.length;
    }

    removeItem(id) {
        if (id) {
            return this.fileSystemManager.removeItemFromFile(id);
        }
        return this.fileSystemManager.cleanTodoFile();
    }

    async _handleItem(item) {
        const response = { item };
        const pokemonExist = this.checkIfPokemonExists(item);
        if (pokemonExist) {
            response.type = 'pokemonExists';
            response.pokemon = pokemonExist.pokemon;
            return response;
        }
        const pokemon = await this.pokemonClient.getPokemon(item.toLowerCase());
        if (pokemon.success) {
            response.type = 'pokemon';
            response.pokemon = {name:pokemon.body.name, id:pokemon.body.id, image:pokemon.body.sprites.front_default, types:pokemon.body.types}
            
        }
        else if (pokemon.error && !isNaN(item) && !item.toString().includes('.')) {
            response.type = 'pokemonNotFound';
        } else {
            response.type = 'text';
        }
        response.checked = false;
        this._handleTodoMessage(response);
        const newItem = this.insertItem(response);

        return newItem;
    }

    insertItem({ item, pokemon, type, message, checked }) {
        return this.fileSystemManager.addItemToFile({
            id: generateUniqueID(),
            type,
            item,
            pokemon,
            message,
            checked
        });
    }

    _handleTodoMessage(todo) {
        switch (todo.type) {
            // case 'notFoundPokemons': {
            //     todo.message = `Failed to fetch pokemon with this input: ${todo.item}`;
            //     break;
            // }
            case TODO_MASSAGES.POKEMON_NOT_FOUND: {
                todo.message = `Pokemon with ID ${todo.item} was not found`;
                break;
            }
            case TODO_MASSAGES.TEXT: {
                todo.message = todo.item;
                break;
            }
            case TODO_MASSAGES.POKEMON: {
                const { pokemon } = todo;
                todo.message = `Catch #${pokemon.id} ${capitalizeText(pokemon.name)} the ${pokemon.types.map(p => capitalizeText(p.type.name)).join('/')} type pokemon`;
                break;
            }
        }
    }

    checkIfPokemonExists(pokemon) {
        const taskListData = this.fileSystemManager.getAllItems();
        return taskListData?.find(data => (data.pokemon?.id == pokemon || data.pokemon?.name == pokemon.toLowerCase()));
    }

    sortTasks(sortOrder) {
        const taskListData = this.fileSystemManager.getAllItems();
        taskListData?.sort((a, b) => a.message > b.message ? 1 : a.message < b.message ? -1 : 0);
        if (sortOrder === 'Z-A') {
            taskListData?.reverse();
        }
        return taskListData;
    }

}