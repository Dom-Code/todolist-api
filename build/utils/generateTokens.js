"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config/config"));
const generateTokens = (user) => {
    const payload = { _id: user._id };
    const accessToken = jsonwebtoken_1.default.sign(payload, config_1.default.server.ACCESS_TOKEN.secret, {
        issuer: config_1.default.server.ACCESS_TOKEN.issuer,
        algorithm: 'HS256',
        expiresIn: 20
    });
    const refreshToken = jsonwebtoken_1.default.sign(payload, config_1.default.server.REFRESH_TOKEN.secret, {
        issuer: config_1.default.server.REFRESH_TOKEN.issuer,
        algorithm: 'HS256',
        expiresIn: '1m'
    });
};
exports.default = generateTokens;
