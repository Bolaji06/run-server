import { Hono } from "hono";
import { authMiddleware } from "../middleware/authorization";
import { createWorkSpace, getAllWorkSpace, getWorkSpace } from "../controller/workspace.controller";


const workSpaceRoutes = new Hono();

workSpaceRoutes.get('/', authMiddleware, getAllWorkSpace);
workSpaceRoutes.get('/workspaceId', authMiddleware, getWorkSpace);
workSpaceRoutes.post('/:username', authMiddleware, createWorkSpace);
workSpaceRoutes.patch()

export default workSpaceRoutes;