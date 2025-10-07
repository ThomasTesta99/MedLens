'use server'
import { headers } from "next/headers"
import { auth } from "../auth"
import { Action, CreateUserInfo, SignInUserInfo, User } from "@/types/types"
import { validateWithArcjet } from "../arcjet"
import { db } from "@/database/drizzle"
import { users } from "@/database/schema"
import { eq } from "drizzle-orm"

export const signInUser = async ({email, password} : SignInUserInfo) => {
    try {
        const user = await auth.api.signInEmail({
            body: {
                email, 
                password
            },
            headers: await headers(),
        })

        return {
            success: true, 
            message: "User successfuly logged in." + user,
        }
    } catch (error) {
        return {
            success: false,
            message: "Failed to log in: " + error,
        }
    }
}

export const signUpUser = async ({name, email, password} : CreateUserInfo) => {
    try {
        const newUser = await auth.api.signUpEmail({
            body: {
                name, 
                email, 
                password,
            },
            headers: await headers(),
        })

        return {
            success: true, 
            message: "Signed Up sucessfully. " + newUser,
        }
    } catch (error) {
        return {
            success: false,
            message: "Failed to sign up user: " + error,
        }
    }
}

export const signOutUser = async () => {
    await auth.api.signOut({headers: await headers()});
}

export const getUserSession = async () => {
    const session = await auth.api.getSession({headers: await headers()});
    return session
}

export const changePassword = async ({oldPassword, newPassword} : {oldPassword: string, newPassword : string}) => {
    try {
        const data = await auth.api.changePassword({
            body:{
                newPassword: newPassword, 
                currentPassword: oldPassword,
                revokeOtherSessions: true,
            },
            headers: await headers(),
        })
        return {
            success: true,
            message: "Password successfully changed",
            data: data
        }
    } catch (error) {
        return {
            success: false, 
            message: "There was an error changing your password: " + error as string,
        }
    }
}

export const deleteUserAccount = async ({password}: {password: string}) => {
    try {
        const session = await getUserSession();
        if(!session?.user.id){
            return {
                success: false, 
                message: "Unauthorized",
            }
        }

        const result = await auth.api.deleteUser({
            body: {
                password: password,
            },
            headers: await headers(),
        })

        if(result.success){
            await auth.api.signOut({headers: await headers()});
        }

        return {
            success: result.success,
            message: result.message,
        }

    } catch (error) {
        return{
            success: false, 
            message: "There was an error deleting your account: " + error as string,
        }
    }
}

export const checkRate = async (fingerprint: string, scope: Action) => {
    const rateCheck = await validateWithArcjet(fingerprint, scope);
    return rateCheck;
}

export const resetUserPassword = async ({password, token}: {password: string, token: string}) => {
    try {
        const data = await auth.api.resetPassword({
            body:{
                newPassword: password, 
                token: token,
            },
            headers: await headers(),
        })

        if(!data.status){
            return {
                success: false, 
                message: "Failed to reset password."
            }
        }else{
            return {
                success: true, 
                message: "Successfully reset password"
            }
        }
    } catch (error) {
        return{
            success: false, 
            message: "Failed to reset password: " + error as string,
        }
    }
}

export const sendResetPasswordEmail = async ({email, url}: {email: string, url: string}) =>{
    try {
        const result = await auth.api.forgetPassword({
            body:{
                email: email, 
                redirectTo: url, 
            },
            headers: await headers(),
        });

        if(!result.status){
            return {
                success: false, 
                message: "Failed to send."
            }
        }else{
            return {
                success: true, 
                message: "Successfully sent reset password link"
            }
        }
    } catch (error) {
        return {
                success: false, 
                message: "Failed to send link: " + error as string,
            }
    }
}

export const getUserByEmail = async ({email} : {email : string}) => {
    try {
        const result = await db.select().from(users).where(eq(users.email, email));

        const foundUser = result[0]; 

        if (!foundUser) {
            return { success: false, message: 'User not found' };
        }

        return {
            success: true,
            user: foundUser,
        };
    } catch (error) {
        return {
        success: false,
        message: 'Server error while fetching user',
        };
    }
}

export const sendEmailVerification = async ({email, url} : {email:string, url: string}) => {
    try {
        const result = await auth.api.sendVerificationEmail({
            body:{
                email: email, 
                callbackURL: url,
            },
            headers: await headers(), 
        })

        if(!result.status){
            return {
                success: false, 
                message: "Failure to send verification email"
            }
        }else{
            return {
                success: true, 
                message: "Verification email sent",
            }
        }
    } catch (error) {
        return{
            success: false, 
            message: "Failed to send verification email. " + error as string,
        }
    }
}

export const changeEmailRequest = async ({newEmail, url = '/'}: {newEmail : string, url?: string}) => {
    try {
        const result = await auth.api.changeEmail({
            body:{
                newEmail: newEmail, 
                callbackURL: url
            },
            headers: await headers(),
        })

        if(!result.status){
            return {
                success: false, 
                message: "Failed to send change email approval",
            }
        }else{
            return {
                success: true, 
                message: "Send change email approval",
            }
        }
    } catch (error) {
        console.log(error);
        return{
            success: false, 
            message: "Failed to send change email approval."
        }
    }
}