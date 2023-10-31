import user_tb from "../models/user_tb";
import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import archiver from "archiver";
import { generateToken } from "../config/passport";
import sharp from "sharp";
import path from 'path';
import fs from 'fs';
import { unlink } from "fs/promises";

export const ping = async (req: Request, res: Response) => {
    res.json('pong')
}

export const Cadastro = async (req: Request, res: Response) => {
    try{
        let nome:string = req.body.nome;
        let dsNome:string = req.body.dsnome;
        const senha:string = req.body.senha;
        console.log(nome)
        const salt = bcrypt.genSaltSync(5);
        const hash = bcrypt.hashSync(senha as string, salt);
        let usuario = await user_tb.findOne({email: nome});
        if(usuario){
            res.status(204).json('Já existe usuário com esse email cadastrado.');
        }
        else{
            // Encontre o usuário com o maior _id
            const lastUser = await user_tb.findOne().sort({ _id: -1 });

            // Se nenhum usuário for encontrado, defina o _id como 1, caso contrário, incremente o maior _id encontrado
            const _id = lastUser ? lastUser._id.valueOf() + 1 : 1;

            let newUser = new user_tb();
            
            newUser._id = _id;
            newUser.caminho = '';
            newUser.email = nome;
            newUser.nome = dsNome;
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
            res.status(561).json('Email não cadastrado');
            console.log('user ',usuario,' Email não cadastrado');
        }
        else{
            const match = await bcrypt.compare(senha, usuario?.senha as string)
            if(match)
            {
                const token = generateToken({ email: usuario.email })
                usuario.token = token; 
                console.log(token)
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

export const uploadFile = async(req:Request, res:Response)=>{
    try{
        if(req.file){
            const usuario = await user_tb.findOne({token: req.headers.authorization?.replace('Bearer ','')});
            
            await sharp(req.file.path).toFormat('png').toFile(`./public/media/${usuario?.email.split('@')[0]}.png`)
            const filepath = path.join(__dirname, '..', '..', 'public', 'media', `${usuario?.email.split('@')[0]}.png`);
            if(usuario)
            {
                usuario.caminho = `${usuario?.email.split('@')[0]}.png`
                await usuario.save()
            }
            await unlink(req.file.path)
            res.json(usuario)
        }
        else{
            res.status(400).json({error: 'arquivo inválido!'});
        }
    }
    catch(err)
    {
        res.status(404).json(err)
    }
};

export const loadUser = async(req:Request, res:Response)=>{
    try{
        const result = await user_tb.find({});
        console.log(result)
        res.json(result)
    }
    catch(err){
        res.status(404).json({error: err})
    }
};

export const ImageView = async(req:Request, res:Response)=>{
    const filename = req.params.filename;
    const filepath = path.join(__dirname, '..', '..', 'public', 'media', filename);

    console.log(filepath)
    fs.access(filepath, fs.constants.F_OK, (err) => {
        if (err) {
            console.error(err);
            res.status(404).send('File does not exist');
        } else {
            res.sendFile(filepath);
        }
    });
};

export const downloadImg = async(req: Request, res: Response) => {
    const filepath = path.join(__dirname, '..', '..', 'public', 'media');
    fs.readdir(filepath, (err, files) => {
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        }

        var archive = archiver('zip', {
            zlib: { level: 9 } // Sets the compression level.
        });

        // This event is fired when the data source is drained no matter what was the data source.
        // It is not part of this library but rather from the NodeJS Stream API.
        // @see: https://nodejs.org/api/stream.html#stream_event_drain
        res.on('drain', function() {
            console.log('drain', archive.pointer());
            archive.resume();
        });

        // good practice to catch warnings (ie stat failures and other non-blocking errors)
        archive.on('warning', function(err) {
            if (err.code === 'ENOENT') {
                // log warning
            } else {
                // throw error
                throw err;
            }
        });

        // good practice to catch this error explicitly
        archive.on('error', function(err) {
            throw err;
        });

        // pipe archive data to the response
        archive.pipe(res);

        files.forEach((file) => {
            var fileLocation = path.join(filepath, file);
            archive.file(fileLocation, { name: file });
        });

        archive.finalize();
    });
};

export const findUser = async (req: Request, res: Response) => {
    try{
        let id = req.params.id;
        const usuario = await user_tb.findById({_id : Number(id)});
        
        if(usuario){
            console.log('teste')
            res.status(200).json(usuario);
        }
        else{
            console.log('teste')
        }        
    }catch(error){
        res.status(400)
        console.log('Erro: ', error)
    }
}

export const atualizar = async (req: Request, res: Response) => {
    try{
        let id:number = req.body.id;
        const usuario = await user_tb.findById({_id : Number(id)});
        let nome:string = req.body.nome;
        let password: string = req.body.password;
        if(usuario){
            try{
                if(req.file){
                    
                    await sharp(req.file.path).toFormat('png').toFile(`./public/media/${nome}.png`)
                    const filepath = path.join(__dirname, '..', '..', 'public', 'media', `${nome}.png`);
                    if(usuario)
                    {
                        usuario.nome = nome;
                        if(password)
                        {
                            const salt = bcrypt.genSaltSync(5);
                            const hash = bcrypt.hashSync(password as string, salt);
                            usuario.senha = hash
                        }
                        usuario.caminho = `${usuario?.nome.split('@')[0]}.png`
                        await usuario.save()
                    }
                    await unlink(req.file.path)
                    res.json(usuario)
                }
                else{
                    usuario.nome = nome;
                    if(password)
                    {
                        const salt = bcrypt.genSaltSync(5);
                        const hash = bcrypt.hashSync(password as string, salt);
                        usuario.senha = hash
                    }
                    await usuario.save()
                    res.json(usuario)
                }
            }
            catch(err)
            {
                res.status(404).json(err)
            }
        }
        else{
            console.log('teste')
        }        
    }catch(error){
        res.status(400)
        console.log('Erro: ', error)
    }
}