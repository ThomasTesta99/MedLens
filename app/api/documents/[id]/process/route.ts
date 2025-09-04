import { enqueueProcessing } from "@/lib/pipeline";

export const dynamic = "force-dynamic";

export async function POST(_req: Request, ctx: {params: {id:string}}){
    const {id} = ctx.params;
    console.log("Enqueueing Stuff in Route");
    await enqueueProcessing(id);
    console.log("Back in Route, going to do next");
    return Response.json({ok: true});
}