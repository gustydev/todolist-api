require('dotenv').config();
require('mongoose')

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../models/user')
const Todo = require('../models/todo');

const { body } = require('express-validator');

const { validateInputs } = require('../middlewares/validateInputs');
// Middleware para retornar erro se houver algum dado inválido na entrada de usuário

exports.register = [
    // Validar entradas do usuário com express validator
    body('username')
    .isString()
    .withMessage('Nome de usuário precisa ser uma string')
    .trim()
    .isLength({min: 4, max: 30})
    .withMessage('Nome de usuário precisa ter entre 4 e 30 caracteres')
    .custom(async (value) => {
        const user = await User.findOne({username: value})
        if (user) {
            throw new Error('Nome de usuário indisponível, por favor tentar outro.')
        } 
    }),

    body('password')
    .isString()
    .withMessage('Senha precisa ser uma string')
    .trim()
    .isLength({min: 8})
    .withMessage('Senha precisa ter no mínimo 8 caracteres'),

    validateInputs,

    async(req, res, next) => {
        try {
            const hash = await bcrypt.hash(req.body.password, 10);
            // adiciona criptografia à senha (LGPD)
    
            const user = new User({
                username: req.body.username,
                password: hash
            });
    
            await user.save();

            return res.status(200).json({message: `Usuário ${user.username} criado com sucesso`})
        } catch (err) {
            next(err) // envia erros ao gerenciador de erros do app.js
        }
    }
]

exports.login = [
    body('username')
    .isString()
    .withMessage('Nome de usuário precisa ser string')
    .trim()
    .isLength({min: 4, max: 30})
    .withMessage('Nome de usuário precisa ter entre 4 e 30 caracteres')
    .custom(async (value) => {
        const user = await User.findOne({username: value})
        if (!user) {
            throw new Error("Usuário não encontrado")
        }
    }),

    body('password')
    .isString()
    .withMessage('Senha precisa ser uma string')
    .trim()
    .isLength({min: 8})
    .withMessage('Senha precisa ter no mínimo 8 caracteres')
    .custom(async (value, {req}) => {
        const user = await User.findOne({username: req.body.username})
        if (!user) {
            return false;
        }

        const match = await bcrypt.compare(value, user.password);
        // verifica se senha está correta

        if (!match) { throw new Error('Senha incorreta, por favor tentar novamente')}
    }),

    validateInputs,

    async(req, res, next) => {
        try {
            const user = await User.findOne({username: req.body.username}).select('-password');
            // dados do usuário, omitindo a senha hasheada por segurança

            const token = jwt.sign({id: user._id}, process.env.SECRET, {expiresIn: '30d'});
            // json web token utilizado pra gerenciar autenticação/autorização do site, vence em 30 dias
            // ele é usado nas requests http num header 'Authorization' com valor 'Bearer [token]'

            return res.status(200).json({
                msg: `Logado com sucesso! Token vence em 30 dias`,
                token,
                user
            })
        } catch (err) {
            next(err);
        }
    }
]

exports.list = async(req, res, next) => {
    try {
        const users = await User.find().select('-password -todos');
        // Omite ambas as senhas e os todos de usuários (privacidade)

        return res.status(200).json(users)
    } catch (err) {
        next(err)
    }
}

exports.edit = [
    body('username')
    .isString()
    .withMessage('Nome de usuário precisa ser uma string')
    .trim()
    .isLength({min: 4, max: 30})
    .withMessage('Nome de usuário precisa ter entre 4 e 30 caracteres')
    .custom(async (value) => {
        const user = await User.findOne({username: value})
        if (user) {
            throw new Error('Nome de usuário indisponível, por favor tentar outro.')
        } 
    }),

    validateInputs,

    async(req, res, next) => {
        try {
            const user = await User.findByIdAndUpdate(req.user.id, {
                username: req.body.username
            }, {new: true}).select('-password')
            
            return res.status(200).json({message: 'Usuário atualizado', user})
        } catch (err) {
            next(err)
        }
    }
]

exports.delete = async(req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.user.id).select('-password')
        await Todo.deleteMany({author: req.user.id})

        return res.status(200).json({message: 'Usuário apagado', user})
    } catch (err) {
        next(err)
    }
}