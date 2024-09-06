import { Context } from "hono";

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