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
        return this._sortData(sortOrder);
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
        const res = { item };
        console.log("item: "+item);
        const pokemonExist = this._isPokemonExist(item);
        if (pokemonExist) {
            res.type = 'pokemonExists';
            res.pokemon = pokemonExist.pokemon;
            return res;
        }
        const pokemon = await this.pokemonClient.getPokemon(item.toLowerCase());
        if (pokemon.success) {
            res.type = 'pokemon';
            res.pokemon = {name:pokemon.body.name, id:pokemon.body.id, image:pokemon.body.sprites.front_default, types:pokemon.body.types}
            
        }
        else if (pokemon.error && !isNaN(item) && !item.toString().includes('.')) {
            res.type = 'pokemonNotFound';
        } else {
            res.type = 'text';
        }
        res.checked = false;
        console.log(res);
        this._handleTodoMessage(res);
        const newItem = this._insertItem(res);

        return newItem;
    }

    _insertItem({ item, pokemon, type, message, checked }) {
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

    _isPokemonExist(pokemon) {
        const itemsListData = this.fileSystemManager.getAllItems();
        return itemsListData?.find(data => (data.pokemon?.id == pokemon || data.pokemon?.name == pokemon.toLowerCase()));
    }

    _sortData(sortOrder) {
        const itemsListData = this.fileSystemManager.getAllItems();
        itemsListData?.sort((a, b) => a.message > b.message ? 1 : a.message < b.message ? -1 : 0);
        if (sortOrder === 'Z-A') {
            itemsListData?.reverse();
        }
        return itemsListData;
    }

}