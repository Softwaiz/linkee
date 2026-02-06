import  bcrypt from "bcryptjs";
import { env } from "cloudflare:workers";

export const PasswordModule = {

    randomize(length = 21) {
        const set = 'QWERTYUIOPASDFGHJKLZXCVBNM0987654321qwertyuiopasdfghjklzxcvbnm1234567890';
        let output = '';

        for (let i = 0; i < length; i++) {
            let index = Math.floor(Math.random() * set.length);
            output += set.charAt(index);
        }

        return output;
    },

    hash(password: string) {
        return bcrypt.hash(password, parseInt(env.WORK_FACTOR));
    },

}