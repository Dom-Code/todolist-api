"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterSchema = exports.LoginSchema = exports.ValidateJoi = void 0;
const joi_1 = __importDefault(require("joi"));
const ValidateJoi = (schema) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield schema.validateAsync(req.body);
            next();
        }
        catch (err) {
            console.log(err);
            return res.status(422).json({ message: err });
        }
    });
};
exports.ValidateJoi = ValidateJoi;
exports.LoginSchema = joi_1.default.object({
    email: joi_1.default.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    password: joi_1.default.string().pattern(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,16}$'))
});
exports.RegisterSchema = joi_1.default.object({
    email: joi_1.default.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    name: joi_1.default.string(),
    password: joi_1.default.string().pattern(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,16}$'))
    // repeat_password: Joi.ref('password')
});
