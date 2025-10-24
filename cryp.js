import { randomBytes } from 'crypto';

const secret = randomBytes(64).toString('hex');
console.log('JWT_SECRET generado:', secret); 
