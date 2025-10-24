import jwt from 'jsonwebtoken';
import { JWT_SECRET } from './config.js';

export function authenticateJWT(req,res,next){ 
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(401).json({message: "Token no proporcionado"});

    }

    const [scheme, token] = authHeader.split(' ');
    if(scheme !== "Bearer" || !token){
        return res.status(401).json({message:"Formato de token no válido"});


    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido o expirado' });
    }
}