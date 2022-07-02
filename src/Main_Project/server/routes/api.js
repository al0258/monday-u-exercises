// Define your endpoints here (this is your "controller file")

// import express from 'express'
// import { getTodosSchema, todoSchema, validateSchema, validateIdSchema } from '../validators/api-validators.js';
// import ItemManager from '../services/item-manager.js';

const express = require('express');
const { getTodosSchema, todoSchema, validateSchema, validateIdSchema } = require('../validators/api-validators.js');
const itemManager = require('../services/item-manager');

// const itemManager = new ItemManager()
const router = express.Router()

router.get('/todos', validateSchema(getTodosSchema), (req, res, next) => {
    errWrapper(async () => {
        const { sortBy } = req.query
        const data = await itemManager.getAllItems(sortBy);
        res.status(200).json(data);
    }, next);
});

router.get('/todo/:id', validateSchema(validateIdSchema), (req, res, next) => {
    errWrapper(async () => {
        const { id } = req.params
        const data = itemManager.getItem(id);
        res.status(200).json(data);
    }, next);
});

router.get('/pending-todos', (req, res, next) => {
    errWrapper(async () => {
        const count = itemManager.getItemsLength();
        res.status(200).json({ count });
    }, next);
});

router.post('/todo', validateSchema(todoSchema), async (req, res, next) => {
    errWrapper(async () => {
        const { todo } = req.body
        const data = await itemManager.addItem(todo);
        res.status(200).json(data);
    }, next);
});

router.put('/todo/:id', validateSchema(validateIdSchema), (req, res, next) => {
    errWrapper(async () => {
        const { id } = req.params
        const { todo } = req.body
        const data = itemManager.editItem(id, todo);
        if (!data) {
            return res.status(400).json({
                success: false,
                status: 400,
                error: `Could not find a task with id ${id}`
            })
        }
        res.status(200).json(data);
    }, next);

});

router.delete('/todo/:id', validateSchema(validateIdSchema), (req, res, next) => {
    errWrapper(async () => {
        const { id } = req.params
        const data = itemManager.removeItem(id);
        res.status(200).json(data);
    }, next);
});

router.delete('/todos', (req, res, next) => {
    errWrapper(() => {
        const data = itemManager.removeItem();
        res.status(200).json(data);
    }, next)
});


async function errWrapper(handler, next) {
    try {
        await handler();
    } catch (e) {
        next(e);
    }
}

// export default router;
module.exports = router;
