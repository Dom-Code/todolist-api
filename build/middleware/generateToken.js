"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config/config"));
const generateAccessToken = (user) => {
    return jsonwebtoken_1.default.sign(user, config_1.default.server.ACCESS_TOKEN.secret, {
        issuer: config_1.default.server.ACCESS_TOKEN.issuer,
        algorithm: 'HS256',
        expiresIn: 200
    });
};
exports.default = generateAccessToken;
