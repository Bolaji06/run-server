import { Context } from "hono";
import prisma from "../lib/prisma";

export async function createWorkSpace(c: Context) {
  const username = c.req.param("username");
  const tokenId = c.get("jwtPayload")?.id;
  const { name } = await c.req.json();

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

    let workspaceName = name;

    // if there is no workspace name provided we need to provide
    // a default name of "Untitled-/d+/$"

    if (!workspaceName) {
      const workspaces = await prisma.workspace.findMany({
        where: {
          name: {
            startsWith: "Untitled",
          },
          user: {
            id: user.id,
          },
        },
        orderBy: {
          name: "desc",
        },
      });

      if (workspaces.length > 0) {
        // extracting largest number from "Untitled"
        const latestWorkspace = workspaces[0];
        const match = latestWorkspace.name.match(/Untitled-(\d+)$/);
        const number = match ? parseInt(match[1], 10) : 0;
        workspaceName`Untitled-${number + 1}`;
      } else {
        // no Untitled workspace exits start with "Untitled-1"
        workspaceName = "Untitled-1";
      }
    }

    const newWorkSpace = await prisma.workspace.create({
      data: {
        name: workspaceName,
        user: {
          connect: { id: user.id },
        },
        sheets: {
          create: [
            { contents: "" },
            { contents: "" },
            { contents: "" },
          ]
        }
      },
      include: {
        sheets: true,
      }
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

export async function getWorkSpace(c: Context){
  const workspaceId = c.req.param("workspaceId");

  if (!workspaceId){
    return c.json({ success: false, message: 'invalid id'}, 401)
  }

  try{
    const workspace = await prisma.workspace.findUnique({
      where: {
        id: workspaceId
      },
      include: {
        sheets: true,
        user: true
      }
    });

    if(!workspace){
      return c.json({ success: false, message: 'workspace not found'}, 404);
    }
    return c.json({ success: true, workspace }, 200);

  }catch(error){
    if (error instanceof Error){
      console.log(error);
    }
    return c.json({ success: false, message: 'internal server error' }, 500);
  }
}

export async function updateSheets(c: Context){
  const workspaceId = c.req.param("workspaceId");
  const tokenId = c.get("jwtPayload")?.id;
  const { sheets } = await c.req.json();

  if (!tokenId){
    return c.json({ success: false, message: 'Unauthorized'}, 401)
  }
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: tokenId
      }
    });
    if (!user){
      return c.json({ success: false, message: 'user not found'}, 404)
    }
   
    const workspace = await prisma.workspace.findFirst({
      where: {
        id: workspaceId,
        user: {
          id: user.id
        },
      },
      include: {
        sheets: true,
      }
    })
    if (!workspace){
      return c.json({ success: false, message: 'workspace is Unauthorized or found'}, 404)
    }

    //sheet.id ??
    const updatePromise = sheets.map( async (sheet: { id: string, content: string}) =>{
      return prisma.sheet.update({
        where: {
          id: sheet.id
        },
        data: {
          contents: sheet.content
        }
      })
    })

    await Promise.all(updatePromise);

    return c.json({ success: true, message: 'sheets updated successfully' });
  }catch(error){
    if (error instanceof Error){
      console.log(error);
    }
    return c.json({ success: false, message: 'internal server error' }, 500)
  }
  }