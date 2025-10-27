import jwt from 'jsonwebtoken';
import { JWT_SECRET } from './config.js'; // o process.env.JWT_SECRET

export function authenticateJWT(req, res, next) {
  // Permitir preflight CORS (no trae Authorization)
  if (req.method === 'OPTIONS') return next();

  const authHeader = req.headers.authorization || '';
  const [scheme, token] = authHeader.split(' ');

  if (!/^Bearer$/i.test(scheme) || !token) {
    return res.status(401).json({ message: 'Formato de token no válido' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET); // misma secret que usas al firmar
    req.user = payload;
    return next();
  } catch {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
}
