import jwt from 'jsonwebtoken';
import config from '../config/config';
import IUSER from '../interfaces/user';

const generateAccessToken = (user: any) => {
    return jwt.sign(user, config.server.ACCESS_TOKEN.secret, {
        issuer: config.server.ACCESS_TOKEN.issuer,
        algorithm: 'HS256',
        expiresIn: 200
    });
};

export default generateAccessToken;
