import express from 'express';
import controller from '../controllers/user';
import extractJWT from '../middleware/extractJWT';
import { LoginSchema, RegisterSchema, ValidateJoi } from '../middleware/joi';

const router = express.Router();

router.get('/validate', extractJWT, controller.validateToken);
router.get('/validateTest', controller.validateTest);

router.post('/register', ValidateJoi(RegisterSchema), controller.register);
router.post('/login', ValidateJoi(LoginSchema), controller.login);
router.post('/refresh', controller.refresh);
router.delete('/logout', controller.deleteRefreshToken);

//list options
router.get('/getUsersTodolists', extractJWT, controller.getUsersTodolists);

router.post('/createTodolist', extractJWT, controller.createTodoList);
router.delete('/deleteTodoList', extractJWT, controller.deleteTodoList);
router.put('/editListName', extractJWT, controller.editListName);

//todo options
router.get('/getUsersTodos', extractJWT, controller.getUsersTodos);
router.post('/createTodo', extractJWT, controller.createTodo);
router.delete('/deleteTodo', extractJWT, controller.deleteTodo);
router.put('/toggleCompleted', extractJWT, controller.toggleCompleted);
router.put('/editTodo', extractJWT, controller.editTodo);

router.get('/get/all', controller.getAllUsers);
router.post('/token', controller.token);

export = router;
