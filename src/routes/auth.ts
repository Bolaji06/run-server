import { Hono } from "hono";
import { register } from "../controller/auth.controller";
import { create } from "domain";
import { registerValidator } from "../middleware/register.validator";

const authRoutes = new Hono();

authRoutes.post('/register', registerValidator, register);

export default authRoutes;

