import { Router } from "express";
import * as home from "../controllers/Cadastro";

const router = Router();

router.route('/register').post(home.Cadastro);
router.route('/login').post(home.Cadastro);

export default router;