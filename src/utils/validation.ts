import { string, z } from "zod";

export const registerSchema = z.object({
    email: z.string().email({ message: 'invalid email' }),
    password: z.string({ required_error: 'password is required' })
    .min(5, { message: 'password is too small min is 5'})
    .max(20, { message: 'password is too long maximum is 20' }),
    username: string({ required_error: 'username is required' }),
});

export type registerType = z.infer<typeof registerSchema>