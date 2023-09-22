import passport from "passport";
import dotenv from 'dotenv';
import { Response, Request, NextFunction } from "express";
import { ExtractJwt, Strategy as JWTStrategy } from "passport-jwt";
import  jwt  from "jsonwebtoken";
import user from "../models/user";

dotenv.config();

const notAuthorizedJson = { status : 401, message: 'Nao autorizado' };
const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET as string
};

passport.use(new JWTStrategy(options, async(payload, done) =>{
    const result = await user.findOne({email: payload.email});
    if(result){
        return done(null, user);
    }
    else
    {
        return done(notAuthorizedJson, false);
    }
}));

export const generateToken = (data: object) =>{
    return jwt.sign(data, process.env.JWT_SECRET as string);
}

export const privateRoute = (req: Request, res: Response, next: NextFunction) =>{
    passport.authenticate('jwt', (err:any, user:any)=>{
        req.user = user;
        return user ? next() : next(notAuthorizedJson);
    })(req,res,next)
}


export default passport;