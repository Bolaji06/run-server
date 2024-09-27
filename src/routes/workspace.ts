import { Hono } from "hono";
import { authMiddleware } from "../middleware/authorization";
import { createWorkSpace, getAllWorkSpace, getWorkSpace, searchWorkSpace, updateSheets } from "../controller/workspace.controller";


const workSpaceRoutes = new Hono();

workSpaceRoutes.get('/', authMiddleware, getAllWorkSpace);
workSpaceRoutes.get('/search', authMiddleware, searchWorkSpace)
workSpaceRoutes.get('/:workspaceId', getWorkSpace);
workSpaceRoutes.post('/:username', authMiddleware, createWorkSpace);
workSpaceRoutes.patch('/:workspaceId', authMiddleware, updateSheets);

export default workSpaceRoutes;