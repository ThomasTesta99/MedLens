import { db } from "@/database/drizzle";
import { getUserSession } from "./user-actions/authActions"
import { jobs } from "@/database/schema";
import { eq } from "drizzle-orm";

export const getAllJobErrors = async () => {
    try {
        const session = await getUserSession();
        const user = session?.user;
        if(!user || user.role !== "admin"){
            return {
                success: false, 
                message: "Unautherized",
            }
        }

        const jobList = await db.select().from(jobs).where(eq(jobs.status, "error"));

        return{
            success: true, 
            message: "Retrieved all job errors", 
            jobList: jobList, 
        }
    } catch (error) {
        return{
            success: false, 
            message: "Error getting job errors", 
            error: error, 
        }
    }
}