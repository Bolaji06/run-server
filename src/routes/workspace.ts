import { Hono } from "hono";
import { authMiddleware } from "../middleware/authorization";
import {
  createWorkSpace,
  deleteWorkspace,
  getAllWorkSpace,
  getWorkSpace,
  renameWorkspace,
  updateSheets,
} from "../controller/workspace.controller";

const workSpaceRoutes = new Hono();

workSpaceRoutes.get("/", authMiddleware, getAllWorkSpace);
workSpaceRoutes.get("/:workspaceId", getWorkSpace);
workSpaceRoutes.post("/:username", authMiddleware, createWorkSpace);
workSpaceRoutes.patch("/:workspaceId", authMiddleware, updateSheets);
workSpaceRoutes.patch("/rename/:workspaceId", authMiddleware, renameWorkspace);
workSpaceRoutes.delete("/:workspaceId", authMiddleware, deleteWorkspace);

export default workSpaceRoutes;
