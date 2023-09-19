import User from "../models/user";
import { Request, Response } from "express";
import bcrypt from 'bcrypt';

export const Cadastro = async (req: Request, res: Response) => {
    try{
        let nome:string = req.body.nome;
        const senha:string = req.body.senha;
        const salt = bcrypt.genSaltSync(5);
        const hash = bcrypt.hashSync(senha as string, salt);
        let usuario = await User.findOne({email: nome});
        if(usuario){
            res.status(204).json('Já existe usuário com esse email cadastrado.');
        }
        else{
            let newUser = new User();
            newUser.email = nome;
            newUser.senha= hash;
            let result = await newUser.save();
            res.status(200).json(result);
        }        
    }catch(error){
        res.status(400)
        console.log('Erro: ', error)
    }
}

export const Login = async() =>{
    
}