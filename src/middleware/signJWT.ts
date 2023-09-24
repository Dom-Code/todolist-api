import jwt from 'jsonwebtoken';
import config from '../config/config';
import logging from '../config/logging';
import IUSER from '../interfaces/user';

const NAMESPACE = 'Authorization';

const signJWT = (user: IUSER, callback: (error: Error | null, accessToken: string | null, refreshToken: string | null) => void): void => {
    let timeSinchEpoch = new Date().getTime();
    let expireTime = timeSinchEpoch + Number(config.server.ACCESS_TOKEN.expireTime) * 100000;
    let exiprationTimeInSeconds = Math.floor(expireTime / 1000);

    logging.info(NAMESPACE, `Attempting to sign token for ${user.email}`);
    // console.log(exiprationTimeInSeconds);
    try {
        const userData = {
            email: user.email,
            id: user._id
        };
        jwt.sign(
            userData,
            config.server.ACCESS_TOKEN.secret,
            {
                issuer: config.server.ACCESS_TOKEN.issuer,
                algorithm: 'HS256',
                expiresIn: '3m'
            },
            (error, accessToken) => {
                if (error) {
                    callback(error, null, null);
                } else if (accessToken) {
                    const getRefreshToken = () => {
                        return jwt.sign(userData, config.server.REFRESH_TOKEN.secret, {
                            issuer: config.server.REFRESH_TOKEN.issuer,
                            algorithm: 'HS256',
                            expiresIn: '15m'
                        });
                    };

                    callback(null, accessToken, getRefreshToken());
                }
            }
        );
    } catch (error: any) {
        logging.error(NAMESPACE, error.message, error);
        callback(error, null, null);
    }
};

export default signJWT;
