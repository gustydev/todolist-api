require('dotenv').config();
require('mongoose')

const { validateInputs } = require('../middlewares/validateInputs');
const Todo = require("../models/todo");

const { body } = require('express-validator');

exports.list = async(req, res, next) => {
    try {
        const todos = await Todo.find({author: req.user.id})

        return res.status(200).json(todos)
    } catch (err) {
        next(err)
    }
}

exports.create = [
    body('name')
    .isString()
    .withMessage('Nome precisa ser string')
    .trim()
    .isLength({min: 4, max: 50})
    .withMessage('Nome precisa ter entre 4 e 50 caracteres'),

    body('description')
    .isString()
    .withMessage('Descrição precisa ser string')
    .trim()
    .isLength({min: 1, max: 200})
    .withMessage('Descrição precisa ter entre 1 e 200 caracteres'),

    validateInputs,

    async(req, res, next) => {
        try {
            const todo = await Todo.create({...req.body, author: req.user.id})

            return res.status(200).json(todo)
        } catch (err) {
            next(err)
        }
    }
]

exports.edit = [
    body('name')
    .isString()
    .withMessage('Nome precisa ser string')
    .trim()
    .isLength({min: 4, max: 50})
    .withMessage('Nome precisa ter entre 4 e 50 caracteres'),

    body('description')
    .isString()
    .withMessage('Descrição precisa ser string')
    .trim()
    .isLength({min: 1, max: 200})
    .withMessage('Descrição precisa ter entre 1 e 200 caracteres'),

    validateInputs,

    async(req, res, next) => {
        try {
            const todoToBeEdited = await Todo.findById(req.params.todoId)

            if (!todoToBeEdited.author.equals(req.user.id)) {
                return res.status(403).json({message: 'Proibido editar uma todo alheia'})
            }

            const todo = await Todo.findByIdAndUpdate(req.params.todoId, {...req.body}, {new: true})

            return res.status(200).json(todo);
        } catch (err) {
            next(err)
        }
    }
]

exports.delete = async(req, res, next) => {
    try {
        const todoToBeDeleted = await Todo.findById(req.params.todoId)

        if (!todoToBeDeleted.author.equals(req.user.id)) {
            return res.status(403).json({message: 'Proibido deletar uma todo alheia'})
        }

        const todo = await Todo.findByIdAndDelete(req.params.todoId)

        res.status(200).json({message: 'Todo apagada', todo})
    } catch (err) {
        next(err)
    }
}