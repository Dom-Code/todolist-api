"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logging_1 = __importDefault(require("../config/logging"));
const NAMESPACE = 'DB';
const checkTodoId = (req, res, next) => {
    logging_1.default.info(NAMESPACE, 'Checking if todo exists');
    console.log(req.body);
};
exports.default = checkTodoId;
