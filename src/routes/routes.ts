import { Router } from "express";
import * as home from "../controllers/Cadastro";
import { privateRoute } from "../config/passport";
import multer from "multer";
import path  from 'path'

const storageConfig = multer.diskStorage(
    {
        destination: (req, file, cb) => {
            cb(null, path.resolve(__dirname, ".."));
        },
        filename: (req,file,cb) => {
            let randomName = Math.floor(Math.random() * 999999)
            cb(null, `${randomName}.png`);
        }
    }
);

const upload = multer({
    storage: storageConfig,
});

const router = Router();

router.route('/ping').get(privateRoute, home.ping);
router.route('/register').post(home.Cadastro);
router.route('/login').post(home.Login);
router.route('/verify').get(privateRoute, home.verify);
router.route('/all').get(privateRoute, home.loadUser);
router.route('/images/:filename').get(home.ImageView);
router.route('/download').get(home.downloadImg);
router.route('/find/:id').get(home.findUser);
router.route('/del').delete(privateRoute, home.deletar);
router.route('/atualizar').put( upload.single('avatar'), home.atualizar);

router.route('/upload').post(privateRoute, upload.single('avatar'), home.uploadFile);

export default router;