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
exports.Login = exports.Cadastro = void 0;
const user_1 = __importDefault(require("../models/user"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const Cadastro = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let nome = req.body.nome;
        const senha = req.body.senha;
        const salt = bcrypt_1.default.genSaltSync(5);
        const hash = bcrypt_1.default.hashSync(senha, salt);
        let usuario = yield user_1.default.findOne({ email: nome });
        if (usuario) {
            res.status(204).json('Já existe usuário com esse email cadastrado.');
        }
        else {
            let newUser = new user_1.default();
            newUser.email = nome;
            newUser.senha = hash;
            let result = yield newUser.save();
            res.status(200).json(result);
        }
    }
    catch (error) {
        res.status(400);
        console.log('Erro: ', error);
    }
});
exports.Cadastro = Cadastro;
const Login = () => __awaiter(void 0, void 0, void 0, function* () {
});
exports.Login = Login;
