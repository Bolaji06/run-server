import { Context } from "hono";
import prisma from "../lib/prisma";

export async function createWorkSpace(c: Context) {
  const username = c.req.param("username");
  const tokenId = c.get("jwtPayload")?.id;
  const body = await c.req.json();

  if (!tokenId) {
    return c.json({ success: false, message: "Unauthorized" }, 401);
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: tokenId,
      },
    });
    if (!user) {
      return c.json({ success: false, message: "user not found" }, 404);
    }
    if (user?.username !== username) {
      return c.json({ success: false, message: "username mismatch" }, 404);
    }

    // find workspace with the title name Untitled-1

    const newWorkSpace = await prisma.workspace.create({
      data: {
        name: body?.name || "Untitled-1",
        user: {
          connect: { id: user.id },
        },
      },
    });
    return c.json({ success: true, newWorkSpace }, 201);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
      return c.json({ success: false, message: "internal server error" }, 500);
    }
  }
}
export async function getAllWorkSpace(c: Context) {
  const tokenId = c.get("jwtPayload")?.id;

  if (!tokenId) {
    return c.json({ success: false, message: "Unauthorized" }, 401);
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: tokenId,
      },
    });

    if (!user) {
      return c.json({ success: false, message: "user not found" }, 404);
    }

    const userWorkSpace = await prisma.workspace.findMany({
      where: {
        user: {
          id: user.id,
        },
      },
    });

    if (!userWorkSpace.length) {
      return c.json(
        { success: true, message: "your have no workspace", userWorkSpace: [] },
        200
      );
    }
    return c.json({ success: true, userWorkSpace }, 200);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
    }
    return c.json({ success: false, message: "internal server error" }, 500);
  }
}
