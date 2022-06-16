// The Pokemon Client (using axios) goes here

import axios from "axios";
export default class PokemonClient {
    constructor() {
        this._API_BASE = 'https://pokeapi.co/api/v2/pokemon';
    }

    async getPokemon(pokemon) {
        try {
            const response = await axios.get(`${this._API_BASE}/${pokemon}`);
            const res = this._handleResponse(null, response, pokemon);
            return res;
        } catch (error) {
            console.error(error);
            return this._handleResponse(error);
        }
    }

    _handleResponse(error, response, pokemon) {
        const res = { success: true };
        if (error) {
            res.error = error.toString();
            res.success = false;
            return res;
        }
        const status = response.status;
        if (status == 404) {
            res.error = `Pokemon with ID ${pokemon} was not found`;
            res.success = false;
        } else if (status == 200) {
            res.body = response.data;
        }
        return res;
    }
}
