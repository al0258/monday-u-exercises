// import express from 'express'
// import PokemonClient from "../clients/pokemon_client.js";
const express = require('express');
const PokemonClient = require('../clients/pokemon_client.js');

const router = express.Router();
const pokemonClient = new PokemonClient;

router.get('/:pokemon', async (req, res, next) => {
    const data = await pokemonClient.getPokemon(req.params.pokemon);
    res.status(200).json(data);
});

module.exports = router;

