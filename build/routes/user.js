"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const user_1 = __importDefault(require("../controllers/user"));
const extractJWT_1 = __importDefault(require("../middleware/extractJWT"));
const joi_1 = require("../middleware/joi");
const router = express_1.default.Router();
router.get('/', user_1.default.home);
router.get('/validate', extractJWT_1.default, user_1.default.validateToken);
router.get('/validateTest', user_1.default.validateTest);
router.post('/register', (0, joi_1.ValidateJoi)(joi_1.RegisterSchema), user_1.default.register);
router.post('/login', (0, joi_1.ValidateJoi)(joi_1.LoginSchema), user_1.default.login);
router.post('/refresh', user_1.default.refresh);
router.delete('/logout', user_1.default.deleteRefreshToken);
//list options
router.get('/getUsersTodolists', extractJWT_1.default, user_1.default.getUsersTodolists);
router.post('/createTodolist', extractJWT_1.default, user_1.default.createTodoList);
router.delete('/deleteTodoList', extractJWT_1.default, user_1.default.deleteTodoList);
router.put('/editListName', extractJWT_1.default, user_1.default.editListName);
//todo options
router.get('/getUsersTodos', extractJWT_1.default, user_1.default.getUsersTodos);
router.post('/createTodo', extractJWT_1.default, user_1.default.createTodo);
router.delete('/deleteTodo', extractJWT_1.default, user_1.default.deleteTodo);
router.put('/toggleCompleted', extractJWT_1.default, user_1.default.toggleCompleted);
router.put('/editTodo', extractJWT_1.default, user_1.default.editTodo);
router.get('/get/all', user_1.default.getAllUsers);
router.post('/token', user_1.default.token);
module.exports = router;
