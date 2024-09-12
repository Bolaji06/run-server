import { Hono } from "hono";
import { authMiddleware } from "../middleware/authorization";
import { createWorkSpace, getAllWorkSpace } from "../controller/workspace.controller";


const workSpaceRoutes = new Hono();

workSpaceRoutes.get('/', authMiddleware, getAllWorkSpace);
workSpaceRoutes.post('/:username', authMiddleware, createWorkSpace);

export default workSpaceRoutes;