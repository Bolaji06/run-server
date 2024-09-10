import { Context } from "hono";
import prisma from "../lib/prisma";

export async function getAllUser(c: Context){
    const id = c.req.param("id");

    console.log(id)

    try{
        return c.json({ success: true, message: "OK"}, 200);

    }catch(err){
        console.log(err);
        return c.json({ success: false, message: 'internal server error'}, 500)
    }
}

export async function getUser(c: Context){
    const id = c.req.param("id");

    try {
        const user = await prisma.user.findUnique({
            where: {
                id
            }
        })
        if (!user){
            return c.json({ success: false, message: 'user not found' }, 404);
        }
        return c.json({ success: true, user }, 200)
        
    }catch(error){
        if (error instanceof Error){
            return c.json({ success: false, Error }, 500);
        }else {
            return c.json({ success: false, message: 'internal server error' }, 500);
        }
    }
}