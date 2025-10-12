import { runOneJob } from "@/lib/pipeline";

export const dynamic = "force-dynamic";

export async function POST() {
    const result = await runOneJob();
    return Response.json(result);
}