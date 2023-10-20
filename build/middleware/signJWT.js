"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config/config"));
const logging_1 = __importDefault(require("../config/logging"));
const NAMESPACE = 'Authorization';
const signJWT = (user, callback) => {
    let timeSinchEpoch = new Date().getTime();
    let expireTime = timeSinchEpoch + Number(config_1.default.server.ACCESS_TOKEN.expireTime) * 100000;
    let exiprationTimeInSeconds = Math.floor(expireTime / 1000);
    logging_1.default.info(NAMESPACE, `Attempting to sign token for ${user.email}`);
    // console.log(exiprationTimeInSeconds);
    try {
        const userData = {
            email: user.email,
            id: user._id
        };
        jsonwebtoken_1.default.sign(userData, config_1.default.server.ACCESS_TOKEN.secret, {
            issuer: config_1.default.server.ACCESS_TOKEN.issuer,
            algorithm: 'HS256',
            expiresIn: '3m'
        }, (error, accessToken) => {
            if (error) {
                callback(error, null, null);
            }
            else if (accessToken) {
                const getRefreshToken = () => {
                    return jsonwebtoken_1.default.sign(userData, config_1.default.server.REFRESH_TOKEN.secret, {
                        issuer: config_1.default.server.REFRESH_TOKEN.issuer,
                        algorithm: 'HS256',
                        expiresIn: '15m'
                    });
                };
                callback(null, accessToken, getRefreshToken());
            }
        });
    }
    catch (error) {
        logging_1.default.error(NAMESPACE, error.message, error);
        callback(error, null, null);
    }
};
exports.default = signJWT;
