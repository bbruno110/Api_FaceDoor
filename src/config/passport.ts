import passport from "passport";
import dotenv from 'dotenv';
import { Response, Request, NextFunction } from "express";
import { ExtractJwt, Strategy as JWTStrategy } from "passport-jwt";
import  jwt  from "jsonwebtoken";
import user_tb from "../models/user_tb";
import { UserType } from "../models/user_tb";

dotenv.config();

const notAuthorizedJson = { status : 401, message: 'Nao autorizado' };
const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET_KEY as string
};

passport.use(new JWTStrategy(options, async(payload, done) =>{
    const user = await user_tb.findOne({email: payload.email});
    if(user){
        return done(null, user);
    }
    else
    {
        return done(notAuthorizedJson, false);
    }
}));

export const generateToken = (data: object) =>{
    return jwt.sign(data, process.env.JWT_SECRET_KEY as string, {expiresIn: /*"300s"*/ '60h'});
}

export const privateRoute = (req: Request, res: Response, next: NextFunction) =>{
    passport.authenticate('jwt', (err:any, user: UserType)=>{
        req.user = user.email;
        return user ? next() : next(notAuthorizedJson);
    })(req,res,next)
}


export default passport;