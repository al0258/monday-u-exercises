// The ItemManager should go here. Remember that you have to export it.

// import FileSystemManager from "./file-system-manager.js";
// import PokemonClient from "../clients/pokemon_client.js";
// import { generateUniqueID, capitalizeText } from "../../utils/string-utils.js";
// import {Item} from "../db/models/item.js";
// import res from "express/lib/response";
// import Op from 'sequelize'
const PokemonClient = require ("../clients/pokemon_client.js");
const { generateUniqueID, capitalizeText } = require ("../../utils/string-utils.js");
const {Item} = require ("../db/models");
const res = require("express/lib/response");
const Op = require('sequelize').Op;

const TODO_MASSAGES = {
    POKEMON_NOT_FOUND: 'pokemonNotFound',
    TEXT: 'text',
    POKEMON: 'pokemon'
  }

class ItemManager {
    constructor() {
        this.pokemonClient = new PokemonClient;
        // this.fileSystemManager = new FileSystemManager;
        this.itemAmount = 0;
    }

    async addItem(userInput) {
        const items = userInput
            .split(',')
            .map(s => s.trim())
            .filter(Boolean);
        return Promise.all(items.map(item => this._handleItem(item)));
    }

    async editItem(id, item) {
        const updatedObject = {
            item_name: item.item,
            item_status: item.checked,
            item_done_timestamp: item.doneTimestamp ? item.doneTimestamp : null
        };

        if(item.type === 'text'){
            this._handleTodoMessage(item);
            updatedObject.item_message = item.message
        }

        await Item.update(updatedObject,{
            where: {item_id:id}
        })
        const newItem = await this.getItem(id);
        return newItem.dataValues;
    }

    getItem(item) {
        return Item.findByPk(item);
    }

    async getAllItems(sortOrder) {
        const items = await Item.findAll();
        const data = items.map(item => this._prepareItem(item.dataValues));
        return this.sortTasks(sortOrder, data);
    }

    // getItemsLength() {
    //     return this.fileSystemManager.getAllItems()?.length;
    // }

    async removeItem(id) {
        if (id) {
            return await Item.destroy({where: {item_id:id}, });
            // return this.fileSystemManager.removeItemFromFile(id);
        }
        return await Item.destroy({where:{}, truncate:true});
    }

    async _handleItem(item) {
        const response = { item };
        // const isExist = await this._isTodoExist(item);
        // if (isExist) {
        //     return isExist;
        // }
        const pokemon = await this.pokemonClient.getPokemon(item.toLowerCase());
        if (pokemon.success) {
            response.type = 'pokemon';
            response.pokemon = pokemon.body;
        }
        else if (pokemon.error && !isNaN(item) && !item.toString().includes('.')) {
            response.type = 'pokemonNotFound';
        } else {
            response.type = 'text';
        }
        this._handleTodoMessage(response);
        // console.log(item);
        const newItem = await this.insertItem(response);
        console.log("ffffff"+response);

        return newItem;
    }

    async insertItem({ item, pokemon, type, message }) {
        const id = generateUniqueID();
        try {
            
            await Item.create({
                'item_id': id,
                'item_name': item,
                'item_type': type,
                'item_message': message,
                'item_status': false,
                'pokemon_id': pokemon?.id.toString() || null,
                'pokemon_name': pokemon?.name || null,
                "pokemon_type": 'fire',
                "pokemon_image": pokemon?.sprites.front_default || null
            });
        } catch (error) {
            console.log(error);
        }

        return {
            id,
            type,
            item,
            pokemon,
            message
        };
    }

    _handleTodoMessage(todo, type) {
        switch (todo.type || type) {
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

    async _isTodoExist(item) {
        const itemFound = (await Item.findOne({
            where:
            {
                [Op.or]:
                    [{ item_name: { [Op.eq]: item } },
                    { pokemon_id: { [Op.eq]: item } },
                    { pokemon_name: { [Op.eq]: item } }]
            }
        }))
            ?.dataValues;
        let res = {};
        if (itemFound) {
            if (itemFound.item_type == 'pokemon') {
                res.type = 'pokemonExists';
                res.pokemon = {
                    id: itemFound.pokemon_id,
                    name: itemFound.pokemon_name,
                    type: itemFound.pokemon_type,
                    image: itemFound.pokemon_image
                };
            }
            else if (itemFound.item_type == 'text') {
                res.type = 'todoExists';
                res.item = item;
            }
        }
        return Object.keys(res).length ? res : null;
    }


    async checkIfPokemonExists(pokemon) {
        return !isNaN(pokemon) ?
        (await Item.findOne({ where: { [Op.or]: [{ pokemon_id: { [Op.eq]: pokemon } }, { pokemon_name: { [Op.eq]: pokemon } }] } })) :
        false;
    }

    sortTasks(sortOrder, itemsListData) {
        itemsListData?.sort((a, b) => a.message > b.message ? 1 : a.message < b.message ? -1 : 0);
        if (sortOrder === 'Z-A') {
            itemsListData?.reverse();
        }
        return itemsListData;
    }

    _prepareItem(item) {
        let pokemon = {};
        if (item.item_type == 'pokemon') {
            pokemon = {
                id: item.pokemon_id,
                name: item.pokemon_name,
                type: item.pokemon_type,
                image: item.pokemon_image,
                // done_timestamp: DataTypes.DATE
            }
        }
        return {
            id: item.item_id,
            item: item.item_name,
            type: item.item_type,
            checked: item.item_status,
            message: item.item_message,
            pokemon: pokemon
        }
    }
}

module.exports = new ItemManager();
