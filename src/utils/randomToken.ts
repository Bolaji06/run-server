
import crypto from 'node:crypto'
export function generateRandomToken(){
    const token = crypto.randomBytes(10).toString('hex');
    return token;
}