import { Hono, Next } from "hono";
import {
  deleteUser,
  editUser,
  getAllUser,
  getUser,
} from "../controller/user.controller";
import { authMiddleware } from "../middleware/authorization";

type JwtVariables = {
    id: string;
}

const userRoutes = new Hono<{ Variables: JwtVariables}>();

userRoutes.get("/", getAllUser);
userRoutes.get("/:id", getUser);
userRoutes.patch("/:id", authMiddleware, editUser);
userRoutes.delete("/:id", authMiddleware, deleteUser);

export default userRoutes;
