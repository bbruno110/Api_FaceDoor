import user_tb from "../models/user_tb";
import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import { generateToken } from "../config/passport";

export const ping = async (req: Request, res: Response) => {
    res.json('pong')
}

export const Cadastro = async (req: Request, res: Response) => {
    try{
        let nome:string = req.body.nome;
        const senha:string = req.body.senha;
        console.log(nome)
        const salt = bcrypt.genSaltSync(5);
        const hash = bcrypt.hashSync(senha as string, salt);
        let usuario = await user_tb.findOne({email: nome});
        if(usuario){
            res.status(204).json('Já existe usuário com esse email cadastrado.');
        }
        else{
            let newUser = new user_tb();
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

export const Login = async (req: Request, res: Response) => {
    try{
        let nome:string = req.body.email;
        const senha:string = req.body.senha;
        console.log(nome)

        const usuario = await user_tb.findOne({email: nome});
        
        if(!usuario){
            res.status(204).json('Email não cadastrado');
            console.log('user ',usuario,' Email não cadastrado');
        }
        else{
            const match = await bcrypt.compare(senha, usuario?.senha as string)
            if(match)
            {
                const token = generateToken({ id: usuario.email })
                usuario.token = token;
                await usuario.save();
                res.status(200).json(usuario);
                console.log('user ',usuario,' passou');
            }
            else
            {
                res.status(401).json('Senha inválida!');
                console.log('user ',usuario,' Senha inválida!');
            }
        }        
    }catch(error){
        res.status(400)
        console.log('Erro: ', error)
    }
}

export const verify = async(req:Request, res:Response)=>{

    const token = req.headers.authorization
    res.json(token)
}