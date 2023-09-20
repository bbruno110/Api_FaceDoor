"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongo_1 = require("./database/mongo");
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const multer_1 = require("multer");
const dotenv_1 = __importDefault(require("dotenv"));
const routes_1 = __importDefault(require("./routes/routes"));
dotenv_1.default.config();
(0, mongo_1.mongoConnect)();
const server = (0, express_1.default)();
server.use(express_1.default.json());
server.use((0, cors_1.default)());
server.use(express_1.default.urlencoded({ extended: true }));
server.use(express_1.default.static(path_1.default.join(__dirname, "/public")));
server.use(routes_1.default);
server.use((req, res) => {
    res.status(404);
    res.json({ error: 'Endpoint não encontrado.' });
});
const errorHandler = (err, req, res, next) => {
    if (err.status) {
        res.status(err.status);
    }
    else {
        res.status(400); //BAD REQUEST
    }
    if (err.message) {
        res.json({ error: err.message });
    }
    else {
        res.json({ error: 'Ocorreu algum erro, contate o suporte' });
    }
    if (err instanceof multer_1.MulterError) {
        res.json({
            error: err.code,
            message: err.message
        });
    }
};
server.listen(8081);
