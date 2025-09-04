import { runOneJob } from "@/lib/pipeline";

export const dynamic = "force-dynamic";

export async function POST() {
    console.log("running a job");
    const result = await runOneJob();
    console.log("Back from running a job, Result = :", result);
    return Response.json(result);
}