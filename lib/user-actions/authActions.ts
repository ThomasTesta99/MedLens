'use server'
import { headers } from "next/headers"
import { auth } from "../auth"
import { CreateUserInfo, SignInUserInfo } from "@/types/types"

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
        console.log(error)
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
        console.log(error)
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
        console.log(error);
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
        console.log(error);
        return{
            success: false, 
            message: "There was an error deleting your account: " + error as string,
        }
    }
}