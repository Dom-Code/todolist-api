import { Request, Response, NextFunction } from 'express';
import logging from '../config/logging';
import bcryptjs from 'bcryptjs';
import mongoose from 'mongoose';
import signJWT from '../middleware/signJWT';
import generateAccessToken from '../middleware/generateToken';
import Refresh_Token_List from '../models/refresh';
import User from '../models/user';
import Todolist from '../models/todolist';
import Todo from '../models/todo';
import config from '../config/config';
import jwt from 'jsonwebtoken';
import generateTokens from '../utils/generateTokens';

const NAMESPACE = 'User Controller';

const home = (req: Request, res: Response, next: NextFunction) => {
    // logging.info(NAMESPACE, 'Token validated');

    return res.status(200).json({
        message: 'Home Page Test'
    });
};

const validateToken = (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Token validated');

    return res.status(200).json({
        message: 'User is authorized'
    });
};

const validateTest = (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Token validated');

    return res.status(200).json({
        message: 'User is authorized',
        isValid: true
    });
};

const register = (req: Request, res: Response, next: NextFunction) => {
    let { email, name, password } = req.body;
    bcryptjs.hash(password, 10, (hashError, hash) => {
        if (hashError) {
            res.status(500).json({
                message: hashError.message,
                error: hashError
            });
        }
        const _user = new User({
            _id: new mongoose.Types.ObjectId(),
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

const login = (req: Request, res: Response, next: NextFunction) => {
    let { email, password } = req.body;
    User.find({ email: email.toLowerCase() })
        .exec()
        .then((users) => {
            if (users.length !== 1) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            bcryptjs.compare(password, users[0].password, (err, result) => {
                if (result) {
                    // generateTokens(users[0]);

                    signJWT(users[0], (jwtErr, accessToken, refreshToken) => {
                        if (jwtErr) {
                            logging.error(NAMESPACE, 'Unable to sign token', jwtErr);
                            return res.status(401).json({
                                message: 'Unauthorized',
                                error: jwtErr
                            });
                        } else if (accessToken && refreshToken) {
                            const expiredAt = new Date();
                            expiredAt.setSeconds(expiredAt.getSeconds() + config.server.REFRESH_TOKEN.expireTime);
                            const _refresh = new Refresh_Token_List({
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
                } else {
                    return res.status(401).json({ message: 'Unauthorized2' });
                }
            });
        })
        .catch((error) => {
            return res.status(500).json({ message: error.message, error });
        });
};

// returns token and user object

const refresh = (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.body.token;

    Refresh_Token_List.find({ token: refreshToken }, (err: any, data: any) => {
        if (err || data.length !== 1) {
            return res.status(401).json({ message: 'Bad refresh token' });
        }

        try {
            jwt.verify(refreshToken, config.server.REFRESH_TOKEN.secret, (jwtErr: any, decoded: any) => {
                if (jwtErr) {
                    throw new Error(jwtErr);
                }
                jwt.sign(
                    { id: decoded.id, email: decoded.email },
                    config.server.ACCESS_TOKEN.secret,
                    { issuer: config.server.ACCESS_TOKEN.issuer, algorithm: 'HS256', expiresIn: '20s' },
                    (err, accessToken) => {
                        if (err) {
                            throw new Error(String(err));
                        }
                        return res.status(200).json({ accessToken });
                    }
                );
            });
        } catch (err) {
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

const createTodoList = (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body.data);

    const todolistName = req.body.data.name;
    const user_id = res.locals.jwt.id;
    const newId = new mongoose.Types.ObjectId();

    // console.log(req.body);
    const _todolist = new Todolist({
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

const deleteTodoList = (req: Request, res: Response, next: NextFunction) => {
    const listId = req.body.listId;

    Todolist.deleteOne({
        _id: listId
    })
        .then((response) => {
            return res.status(200).json({ response });
        })
        .catch((err) => {
            return res.status(400).json(err);
        });
};

const editListName = (req: Request, res: Response, next: NextFunction) => {
    const listName = req.body.data.listName;
    const listId = req.body.data.listId;

    Todolist.findByIdAndUpdate({ _id: listId }, { name: listName })
        .then(() => {
            return res.status(200).json({ message: 'List name updated.' });
        })
        .catch((err) => {
            console.log(err);
            return res.status(502).json({ message: err });
        });
};

const createTodo = (req: Request, res: Response, next: NextFunction) => {
    const todoName = req.body.data.name;
    const listId = req.body.data.listId;
    const userId = res.locals.jwt.id;
    const todoId = new mongoose.Types.ObjectId();

    Todo.find({ _id: todoId })
        .exec()
        .then((todo) => {
            if (todo.length === 0) {
                const _todo = new Todo({
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
            } else {
                return res.status(409).json({ message: 'Todo already exists' });
            }
        })
        .catch((err) => {
            console.log(err);
        });
};

const deleteTodo = (req: Request, res: Response, next: NextFunction) => {
    const todoId = req.body.todoId;

    Todo.findOneAndDelete({ _id: todoId })
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

const toggleCompleted = (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'TOGGLE COMPLETED');

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

    Todo.findByIdAndUpdate(id, { completed: completed })
        .exec()
        .then((todo) => {
            return res.status(200).json({ message: 'Complete status toggled. ' });
        })
        .catch((err) => {
            console.log(err);
            return res.status(401).json(err);
        });
};

const editTodo = (req: Request, res: Response, next: NextFunction) => {
    const id = req.body.data.editId;
    const name = req.body.data.editName;
    console.log(name);

    Todo.findByIdAndUpdate(
        { _id: id },
        {
            name: name
        }
    )
        .then((response) => {
            console.log(response);
            return res.status(200).json(response);
        })
        .catch((err) => {
            console.log(err);
            return res.status(400).json(err);
        });
};

const getUsersTodolists = (req: Request, res: Response, next: NextFunction) => {
    const id = res.locals.jwt.id;

    Todolist.find({ user_id: id })
        .exec()
        .then((lists) => {
            Todo.find({ user_id: id })
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

const getUsersTodos = (req: Request, res: Response, next: NextFunction) => {
    const id = res.locals.jwt.id;
    Todo.find({ user_id: id })
        .exec()
        .then((todos) => {
            return res.status(200).json({ todos });
        })
        .catch((err) => {
            return res.status(400).json({ err });
        });
};

const getAllUsers = (req: Request, res: Response, next: NextFunction) => {
    User.find()
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

const token = (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Checking if refresh token is valid');

    const { email, refreshToken } = req.body;

    Refresh_Token_List.find({ token: refreshToken }).then(() => {
        res.status(200).json({ accessToken: generateAccessToken({ user: email }) });
    });
};

const deleteRefreshToken = (req: Request, res: Response, next: NextFunction) => {
    Refresh_Token_List.findOneAndDelete({ token: req.body.refreshToken })
        .then((result) => {
            return res.status(200).json({ message: 'User authorization removed' });
        })
        .catch((err) => {
            return res.status(400).json({ err });
        });
};

export default {
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
