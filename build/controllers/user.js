"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logging_1 = __importDefault(require("../config/logging"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const mongoose_1 = __importDefault(require("mongoose"));
const signJWT_1 = __importDefault(require("../middleware/signJWT"));
const generateToken_1 = __importDefault(require("../middleware/generateToken"));
const refresh_1 = __importDefault(require("../models/refresh"));
const user_1 = __importDefault(require("../models/user"));
const todolist_1 = __importDefault(require("../models/todolist"));
const todo_1 = __importDefault(require("../models/todo"));
const config_1 = __importDefault(require("../config/config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const NAMESPACE = 'User Controller';
const home = (req, res, next) => {
    // logging.info(NAMESPACE, 'Token validated');
    return res.status(200).json({
        message: 'Home Page Test'
    });
};
const validateToken = (req, res, next) => {
    logging_1.default.info(NAMESPACE, 'Token validated');
    return res.status(200).json({
        message: 'User is authorized'
    });
};
const validateTest = (req, res, next) => {
    logging_1.default.info(NAMESPACE, 'Token validated');
    return res.status(200).json({
        message: 'User is authorized',
        isValid: true
    });
};
const register = (req, res, next) => {
    let { email, name, password } = req.body;
    bcryptjs_1.default.hash(password, 10, (hashError, hash) => {
        if (hashError) {
            res.status(500).json({
                message: hashError.message,
                error: hashError
            });
        }
        const _user = new user_1.default({
            _id: new mongoose_1.default.Types.ObjectId(),
            email: email.toLowerCase(),
            name: name,
            password: hash,
            todolists: []
        });
        return _user
            .save()
            .then((user) => {
            return res.status(201).json({ user });
        })
            .catch((err) => {
            return res.status(500).json({
                message: err.message,
                err
            });
        });
    });
};
const login = (req, res, next) => {
    let { email, password } = req.body;
    user_1.default.find({ email: email.toLowerCase() })
        .exec()
        .then((users) => {
        if (users.length !== 1) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        bcryptjs_1.default.compare(password, users[0].password, (err, result) => {
            if (result) {
                // generateTokens(users[0]);
                (0, signJWT_1.default)(users[0], (jwtErr, accessToken, refreshToken) => {
                    if (jwtErr) {
                        logging_1.default.error(NAMESPACE, 'Unable to sign token', jwtErr);
                        return res.status(401).json({
                            message: 'Unauthorized',
                            error: jwtErr
                        });
                    }
                    else if (accessToken && refreshToken) {
                        const expiredAt = new Date();
                        expiredAt.setSeconds(expiredAt.getSeconds() + config_1.default.server.REFRESH_TOKEN.expireTime);
                        const _refresh = new refresh_1.default({
                            token: refreshToken,
                            expiryDate: expiredAt.getTime(),
                            userId: users[0]._id
                        });
                        return _refresh
                            .save()
                            .then((user) => {
                            return res.status(200).json({
                                message: 'Auth Successful',
                                accessToken,
                                refreshToken
                            });
                        })
                            .catch((err) => {
                            return res.status(500).json({
                                message: err.message,
                                err
                            });
                        });
                    }
                });
            }
            else {
                return res.status(401).json({ message: 'Unauthorized2' });
            }
        });
    })
        .catch((error) => {
        return res.status(500).json({ message: error.message, error });
    });
};
// returns token and user object
const refresh = (req, res, next) => {
    const refreshToken = req.body.token;
    refresh_1.default.find({ token: refreshToken }, (err, data) => {
        if (err || data.length !== 1) {
            return res.status(401).json({ message: 'Bad refresh token' });
        }
        try {
            jsonwebtoken_1.default.verify(refreshToken, config_1.default.server.REFRESH_TOKEN.secret, (jwtErr, decoded) => {
                if (jwtErr) {
                    throw new Error(jwtErr);
                }
                jsonwebtoken_1.default.sign({ id: decoded.id, email: decoded.email }, config_1.default.server.ACCESS_TOKEN.secret, { issuer: config_1.default.server.ACCESS_TOKEN.issuer, algorithm: 'HS256', expiresIn: '20s' }, (err, accessToken) => {
                    if (err) {
                        throw new Error(String(err));
                    }
                    return res.status(200).json({ accessToken });
                });
            });
        }
        catch (err) {
            return res.status(401).json({ error: `${err}`, message: 'Could not get new access token' });
        }
    });
    // Refresh_Token_List.find({ token: refreshToken }, (err: any, data: any) => {
    //     if (err || data.length !== 1) {
    //         return res.status(403).json({ message: 'Bad refresh token' });
    //     }
    //     jwt.verify(refreshToken, config.server.REFRESH_TOKEN.secret, (jwtErr: any, decoded: any) => {
    //         if (jwtErr) {
    //             // res.status(403).send().json(jwtErr);
    //             // return new Error(jwtErr);
    //             // return new Error('403');
    //             console.log('jwt error');
    //             return res.status(403).json({ message: 'Expired refresh token' });
    //         }
    //         jwt.sign(
    //             { id: decoded.id, email: decoded.email },
    //             config.server.ACCESS_TOKEN.secret,
    //             {
    //                 issuer: config.server.ACCESS_TOKEN.issuer,
    //                 algorithm: 'HS256',
    //                 expiresIn: '20s'
    //             },
    //             (err, accessToken) => {
    //                 if (err) {
    //                     return res.status(401).json({ message: err });
    //                 }
    //                 return res.status(200).json({ accessToken });
    //             }
    //         );
    //     });
    // jwt.verify(refreshToken, config.server.REFRESH_TOKEN.secret, (jwtErr: any, decoded: any) => {
    //     if (jwtErr) {
    //         // res.status(403).send().json(jwtErr);
    //         // return new Error(jwtErr);
    //         // return new Error('403');
    //         return res.status(403).json({ message: 'Expired refresh token' });
    //     }
    //     jwt.sign(
    //         { id: decoded.id, email: decoded.email },
    //         config.server.ACCESS_TOKEN.secret,
    //         {
    //             issuer: config.server.ACCESS_TOKEN.issuer,
    //             algorithm: 'HS256',
    //             expiresIn: '20s'
    //         },
    //         (err, accessToken) => {
    //             if (err) {
    //                 return res.status(401).json({ message: err });
    //             }
    //             return res.status(200).json({ accessToken });
    //         }
    //     );
    // });
    // });
    // Refresh_Token_List.find({ token: refreshToken }, (err: any, data: any) => {
    //     jwt.verify(refreshToken, config.server.REFRESH_TOKEN.secret, (jwtErr: any, decoded: any) => {
    //         if (jwtErr) {
    //             return res.status(401).json({ message: 'Bad refresh token' });
    //         }
    //         const accessToken = jwt.sign({ userId: data[0].userId, email: decoded.email }, config.server.ACCESS_TOKEN.secret, {
    //             issuer: config.server.ACCESS_TOKEN.issuer,
    //             algorithm: 'HS256',
    //             expiresIn: 20
    //         });
    //         return res.status(200).json({ error: false, accessToken, message: 'Access token created' });
    //     });
    // });
    // .then((result) => {
    // jwt.verify(result.token, config.server.REFRESH_TOKEN.secret, (error, decoded) => {
    //     // console.log(decoded);
    //     if (error) {
    //         return res.status(401).json(error);
    //     } else {
    //         res.locals.jwt = decoded;
    //         next();
    //     }
    // });
    // return res.status(200).json({ message: 'Good refresh token' });
    // })
    // .catch((err) => {
    //     return res.status(401).json(err);
    // });
};
const createTodoList = (req, res, next) => {
    console.log(req.body.data);
    const todolistName = req.body.data.name;
    const user_id = res.locals.jwt.id;
    const newId = new mongoose_1.default.Types.ObjectId();
    // console.log(req.body);
    const _todolist = new todolist_1.default({
        _id: newId,
        name: todolistName,
        user_id: user_id
    });
    return _todolist
        .save()
        .then(() => {
        return res.status(200).json({ listId: newId, message: 'Todolist was created' });
    })
        .catch((err) => {
        return res.status(400).json({ err });
    });
};
const deleteTodoList = (req, res, next) => {
    const listId = req.body.listId;
    todolist_1.default.deleteOne({
        _id: listId
    })
        .then((response) => {
        return res.status(200).json({ response });
    })
        .catch((err) => {
        return res.status(400).json(err);
    });
};
const editListName = (req, res, next) => {
    const listName = req.body.data.listName;
    const listId = req.body.data.listId;
    todolist_1.default.findByIdAndUpdate({ _id: listId }, { name: listName })
        .then(() => {
        return res.status(200).json({ message: 'List name updated.' });
    })
        .catch((err) => {
        console.log(err);
        return res.status(502).json({ message: err });
    });
};
const createTodo = (req, res, next) => {
    const todoName = req.body.data.name;
    const listId = req.body.data.listId;
    const userId = res.locals.jwt.id;
    const todoId = new mongoose_1.default.Types.ObjectId();
    todo_1.default.find({ _id: todoId })
        .exec()
        .then((todo) => {
        if (todo.length === 0) {
            const _todo = new todo_1.default({
                _id: todoId,
                name: todoName,
                list_id: listId,
                user_id: userId,
                date: new Date(),
                completed: false
            });
            _todo
                .save()
                .then(() => {
                return res.status(200).json({ message: 'Todo was created', todoId: todoId });
            })
                .catch((err) => {
                console.log(err);
            });
        }
        else {
            return res.status(409).json({ message: 'Todo already exists' });
        }
    })
        .catch((err) => {
        console.log(err);
    });
};
const deleteTodo = (req, res, next) => {
    const todoId = req.body.todoId;
    todo_1.default.findOneAndDelete({ _id: todoId })
        .then((response) => {
        if (response) {
            return res.status(200).json({ message: 'deleted' });
        }
        res.status(400).json({ message: 'todo not found' });
    })
        .catch((err) => {
        return res.status(400);
    });
};
const toggleCompleted = (req, res, next) => {
    logging_1.default.info(NAMESPACE, 'TOGGLE COMPLETED');
    const id = req.body.data.todoId;
    const completed = req.body.data.completed;
    // Todo.find({ _id: id }).then((res) => {
    //     console.log(res[0].completed);
    //     Todo.findOneAndUpdate(id, { completed: !res[0].completed })
    //         .exec()
    //         .then((todo) => {
    //             return res.status(200);
    //         });
    // });
    todo_1.default.findByIdAndUpdate(id, { completed: completed })
        .exec()
        .then((todo) => {
        return res.status(200).json({ message: 'Complete status toggled. ' });
    })
        .catch((err) => {
        console.log(err);
        return res.status(401).json(err);
    });
};
const editTodo = (req, res, next) => {
    const id = req.body.data.editId;
    const name = req.body.data.editName;
    console.log(name);
    todo_1.default.findByIdAndUpdate({ _id: id }, {
        name: name
    })
        .then((response) => {
        console.log(response);
        return res.status(200).json(response);
    })
        .catch((err) => {
        console.log(err);
        return res.status(400).json(err);
    });
};
const getUsersTodolists = (req, res, next) => {
    const id = res.locals.jwt.id;
    todolist_1.default.find({ user_id: id })
        .exec()
        .then((lists) => {
        todo_1.default.find({ user_id: id })
            .exec()
            .then((todos) => {
            return res.status(200).json({ lists, todos });
        })
            .catch((err) => {
            return res.status(404).json({ err });
        });
    })
        .catch((err) => {
        return res.status(404).json({ err });
    });
};
const getUsersTodos = (req, res, next) => {
    const id = res.locals.jwt.id;
    todo_1.default.find({ user_id: id })
        .exec()
        .then((todos) => {
        return res.status(200).json({ todos });
    })
        .catch((err) => {
        return res.status(400).json({ err });
    });
};
const getAllUsers = (req, res, next) => {
    user_1.default.find()
        .select('-password')
        .exec()
        .then((users) => {
        return res.status(200).json({
            users,
            count: users.length
        });
    })
        .catch((error) => {
        return res.status(500).json({ message: error.message, error });
    });
};
// returns each user in DB (NO PW)
const token = (req, res, next) => {
    logging_1.default.info(NAMESPACE, 'Checking if refresh token is valid');
    const { email, refreshToken } = req.body;
    refresh_1.default.find({ token: refreshToken }).then(() => {
        res.status(200).json({ accessToken: (0, generateToken_1.default)({ user: email }) });
    });
};
const deleteRefreshToken = (req, res, next) => {
    refresh_1.default.findOneAndDelete({ token: req.body.refreshToken })
        .then((result) => {
        return res.status(200).json({ message: 'User authorization removed' });
    })
        .catch((err) => {
        return res.status(400).json({ err });
    });
};
exports.default = {
    home,
    validateToken,
    validateTest,
    register,
    login,
    refresh,
    createTodoList,
    deleteTodoList,
    editListName,
    getUsersTodolists,
    createTodo,
    deleteTodo,
    editTodo,
    toggleCompleted,
    getUsersTodos,
    getAllUsers,
    token,
    deleteRefreshToken
};
