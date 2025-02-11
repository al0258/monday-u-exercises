// Express boilerplate, hosting the `dist` file, connecting to the routes
const dotenv = require('dotenv');
const express = require('express');
const errorHandler = require('./server/middleware/error_handler.js');
const logger = require('./server/middleware/logger.js');
const todosRouter = require('./server/routes/api.js');
const pokemonRouter = require('./server/routes/pokemon.js');
// import dotenv from 'dotenv'
// import express from 'express'
// import errorHandler from './server/middleware/error_handler.js'
// import logger from './server/middleware/logger.js'
// import todosRouter from './server/routes/api.js'
// import pokemonRouter from './server/routes/pokemon.js'

dotenv.config();

const APP_PORT = process.env.PORT ? parseInt(process.env.PORT) : 8000;

const app = express();

app.use([
    errorHandler,
    logger,
    express.json()
]);

app.use('/', express.static('dist'));

app.use('/api', todosRouter);
app.use('/pokemon', pokemonRouter);

process.on('unhandledRejection', (reason, promise) => {
    // console.log("Unhandled Rejection", reason.message);
    throw reason;
});

process.on('uncaughtException', (error) => {
    console.log("Uncaught Exception", error.stack);
    // process.exit(1);
});

app.listen(APP_PORT, () => console.log(`app listening on port ${APP_PORT}`));