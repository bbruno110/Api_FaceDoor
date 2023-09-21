import { Router } from "express";
import * as home from "../controllers/Cadastro";

const router = Router();

router.route('/ping').get(home.ping);
router.route('/register').post(home.Cadastro);
router.route('/login').post(home.Login);

export default router;