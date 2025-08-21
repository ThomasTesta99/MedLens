'use server'
import { headers } from "next/headers"
import { auth } from "../auth"

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