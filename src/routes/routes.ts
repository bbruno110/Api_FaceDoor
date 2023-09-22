import { Router } from "express";
import * as home from "../controllers/Cadastro";
import { privateRoute } from "../config/passport";

const router = Router();

router.route('/ping').get(privateRoute, home.ping);
router.route('/register').post(home.Cadastro);
router.route('/login').post(home.Login);

export default router;