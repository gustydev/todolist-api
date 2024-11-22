const router = require('express').Router();
const controller = require('../controllers/todoController');
const { validateToken } = require("../middlewares/validateToken"); 

// Retorna a lista das todos do usuário autenticado
router.get('/list', validateToken, controller.list);

// Criar uma nova todo (requer autenticação)
router.post('/', validateToken, controller.create)

// Editar uma todo de ID específico (requer autenticação e apenas criador da todo pode fazer isso)
router.put('/:todoId', validateToken, controller.edit)

// Deletar todo de ID específico (requer autenticação e apenas criador da todo pode fazer isso)
router.delete('/:todoId', validateToken, controller.delete)

module.exports = router;