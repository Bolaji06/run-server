import { Hono } from "hono";
import { getAllUser, getUser } from "../controller/user.controller";

const userRoutes = new Hono();

userRoutes.get('/user', getAllUser);
userRoutes.get('/user/:id', getUser);

export default userRoutes;