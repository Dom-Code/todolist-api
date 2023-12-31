"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const allowedList = ['http://127.0.0.1:5173'];
const options = {
    // origin: allowedList
    origin: '*'
};
const CorsOps = () => {
    return (0, cors_1.default)(options);
};
exports.default = CorsOps;
