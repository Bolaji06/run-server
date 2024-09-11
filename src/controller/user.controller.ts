import { Context } from "hono";
import prisma from "../lib/prisma";

export async function getAllUser(c: Context) {
  const payload = c.get("jwtPayload")
  console.log(payload)
  try {
    const users = await prisma.user.findMany();

    return c.json({ success: true, users }, 200);
  } catch (err) {
    console.log(err);
    return c.json({ success: false, message: "internal server error" }, 500);
  }
}

export async function getUser(c: Context) {
  const id = c.req.param("id");

  const payload = c.get("jwtPayload")
  console.log(payload)

  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) {
      return c.json({ success: false, message: "user not found" }, 404);
    }
    return c.json({ success: true, user }, 200);
  } catch (error) {
    if (error instanceof Error) {
      return c.json({ success: false, Error }, 500);
    } else {
      return c.json({ success: false, message: "internal server error" }, 500);
    }
  }
}

export async function editUser(c: Context) {
  const id = c.req.param("id");
  const { username, avatar } = await c.req.json();
  const tokenId = c.get("jwtPayload")?.id

  if (id !== tokenId){
    return c.json({ success: false, message: 'invalid token'}, 403)
  }


  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!user) {
      return c.json({ success: false, message: "user not found" }, 404);
    }

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        username,
        avatar,
      },
    });
    return c.json({ success: true, message: "profile updated" });
  } catch (error) {
    if (error instanceof Error) {
      return c.json({ success: false, message: Error }, 500);
    } else {
      return c.json({ success: false, message: "internal server error" }, 500);
    }
  }
}

export async function deleteUser(c: Context) {
  const id = c.req.param("id");

  const tokenId = c.get("jwtPayload")?.id

  if (id !== tokenId){
    return c.json({ success: false, message: 'invalid token'}, 403)
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) {
      return c.json({ success: false, message: "user not found" }, 404);
    }
    await prisma.user.delete({
      where: {
        id: user.id,
      },
    });
    return c.json({ success: true, message: "user deleted" }, 200);
  } catch (error) {
    if (error instanceof Error) {
      return c.json({ success: false, error }, 500);
    }
  }
}
