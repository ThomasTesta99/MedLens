import { enqueueProcessing } from "@/lib/pipeline";

export const dynamic = "force-dynamic";

export async function POST(_req: Request, ctx: {params: Promise<{id:string}>}){
    const {id} = await ctx.params;
    await enqueueProcessing(id);
    return Response.json({ok: true});
}