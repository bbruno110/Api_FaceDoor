"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    email: { type: String, required: true },
    senha: { type: String, required: true },
    token: String,
});
const modelName = 'User';
exports.default = (mongoose_1.connection && mongoose_1.connection.models[modelName]) ? mongoose_1.connection.models[modelName] : (0, mongoose_1.model)(modelName, schema);
