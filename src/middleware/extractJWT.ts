import { Request, Response, NextFunction } from 'express';
import logging from '../config/logging';
import jwt from 'jsonwebtoken';
import config from '../config/config';

const NAMESPACE = 'Authorization';

const extractJWT = (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Extract JWT');

    let token = req.headers.authorization?.split(' ')[1];
    if (token) {
        jwt.verify(token, config.server.ACCESS_TOKEN.secret, (error, decoded) => {
            if (error) {
                console.log(error);
                return res.status(403).json(error);
            } else {
                res.locals.jwt = decoded;
                next();
            }
        });
    } else {
        console.log(token);
        return res.status(401).json({
            message: 'Unauthorized'
        });
    }
};

export default extractJWT;
