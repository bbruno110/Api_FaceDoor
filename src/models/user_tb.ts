import { Schema, model, Model, connection } from "mongoose";

export type UserType = {
    _id: Number,
    email: string,
    senha: string,
    token?:string,
    caminho?:string
}

const schema = new Schema<UserType>({
    _id: Number,
    email: { type: String, required: true},
    senha: { type: String, required: true},
    token: String,
    caminho: String
})

const modelName: string = 'user';


export default (connection && connection.models[modelName]) ? connection.models[modelName] as Model<UserType> : model<UserType>(modelName, schema);