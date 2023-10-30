import { Router } from "express";
import * as home from "../controllers/Cadastro";
import { privateRoute } from "../config/passport";
import multer from "multer";
import path  from 'path'

const storageConfig = multer.diskStorage(
    {
        destination: (req, file, cb) => {
            cb(null, path.resolve(__dirname, "..", "tmp"));
        },
        filename: (req,file,cb) => {
            let randomName = Math.floor(Math.random() * 999999)
            cb(null, `${randomName}.png`);
        }
    }
);

const upload = multer({
    storage: storageConfig,
    fileFilter:(req,file,cb) =>{
        const allowed: string[] = ['image/jpg', 'image/png', 'image/jpeg']
        if(allowed.includes(file.mimetype)){
            cb(null, true)
        }
        else{
            cb(null, false)
        }
    }
});

const router = Router();

router.route('/ping').get(privateRoute, home.ping);
router.route('/register').post(home.Cadastro);
router.route('/login').post(home.Login);
router.route('/verify').get(privateRoute , home.verify);
router.route('/all').get(privateRoute , home.loadUser);

router.route('/upload').post(privateRoute, upload.single('avatar'), home.uploadFile);

export default router;