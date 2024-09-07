import { Hono } from "hono";
import { login, logout, register } from "../controller/auth.controller";
import { create } from "domain";
import { registerValidator } from "../middleware/register.validator";

const authRoutes = new Hono();

authRoutes.post('/register', registerValidator, register);
authRoutes.post('/login', login);
authRoutes.get('/logout', logout);

export default authRoutes;

