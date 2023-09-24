import jwt from 'jsonwebtoken';
import IUSER from '../interfaces/user';
import config from '../config/config';

const generateTokens = (user: IUSER) => {
    const payload = { _id: user._id };
    const accessToken = jwt.sign(payload, config.server.ACCESS_TOKEN.secret, {
        issuer: config.server.ACCESS_TOKEN.issuer,
        algorithm: 'HS256',
        expiresIn: 20
    });

    const refreshToken = jwt.sign(payload, config.server.REFRESH_TOKEN.secret, {
        issuer: config.server.REFRESH_TOKEN.issuer,
        algorithm: 'HS256',
        expiresIn: '1m'
    });
};

export default generateTokens;
