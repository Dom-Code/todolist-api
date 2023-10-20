"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logging_1 = __importDefault(require("../config/logging"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config/config"));
const NAMESPACE = 'Authorization';
const extractJWT = (req, res, next) => {
    var _a;
    logging_1.default.info(NAMESPACE, 'Extract JWT');
    let token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (token) {
        jsonwebtoken_1.default.verify(token, config_1.default.server.ACCESS_TOKEN.secret, (error, decoded) => {
            if (error) {
                console.log(error);
                return res.status(403).json(error);
            }
            else {
                res.locals.jwt = decoded;
                next();
            }
        });
    }
    else {
        console.log(token);
        return res.status(401).json({
            message: 'Unauthorized'
        });
    }
};
exports.default = extractJWT;
