// The Pokemon Client (using axios) goes here
const axios = require ('axios');
// import axios from "axios";
class PokemonClient {
    constructor() {
        this._API_BASE = 'https://pokeapi.co/api/v2/pokemon';
        this._CACHE_TIMEOUT_MS = 1000 * 60;
        this._cache = new Map;
    }

    async getPokemon(pokemon) {
        try {
            if (this._cache.has(pokemon)) {
                // console.log(`Getting from the cache`);
                return this._cache.get(pokemon);
            }
            // console.log("Getting from the API");
            const response = await axios.get(`${this._API_BASE}/${pokemon}`);
            const res = this._handleResponse(null, response, pokemon);
            this._saveToCache(pokemon, res);
            return res;
        } catch (error) {
            console.error(error);
            return this._handleResponse(error);
        }
    }

    _handleResponse(error, response, pokemon) {
        const res = {
            success: true
        };
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

    _saveToCache(pokemon, res) {
        this._cache.set(pokemon, res);
        setTimeout(() => this._cache.delete(pokemon), this._CACHE_TIMEOUT_MS);
    }
}
module.exports = PokemonClient;
