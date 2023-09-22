import { Schema, model, Model, connection } from "mongoose";

type UserType = {
    email: string,
    senha: string,
    token?:string,
}

const schema = new Schema<UserType>({
    email: { type: String, required: true},
    senha: { type: String, required: true},
    token: String,
})

const modelName: string = 'user';


export default (connection && connection.models[modelName]) ? connection.models[modelName] as Model<UserType> : model<UserType>(modelName, schema);