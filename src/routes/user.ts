import { Hono } from "hono";
import { getAllUser } from "../controller/user.controller";

const userRoutes = new Hono();

userRoutes.get('/user/:id', getAllUser);

export default userRoutes;