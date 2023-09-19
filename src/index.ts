import express, { ErrorRequestHandler, Request, Response } from 'express';
import { mongoConnect } from './database/mongo';
import cors from 'cors';
import path from 'path';
import { MulterError } from 'multer';
import dotenv from 'dotenv';
import router from './routes/routes';

dotenv.config();

mongoConnect();

const server = express();
server.use(express.json());
server.use(cors());
server.use(express.urlencoded({ extended: true }));
server.use(express.static(path.join(__dirname, "/public")));
server.use(router);
server.use((req:Request, res:Response)=>{
    res.status(404);
    res.json({error: 'Endpoint não encontrado.'});
});
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    if(err.status) {
        res.status(err.status)
    } else {
        res.status(400) //BAD REQUEST
    }
    if(err.message) {
        res.json({error: err.message});
    } else {
        res.json({error: 'Ocorreu algum erro, contate o suporte'})
    }
    if(err instanceof MulterError) {
        res.json({
            error: err.code,
            message: err.message
        })
    }
}

server.listen(8081);
