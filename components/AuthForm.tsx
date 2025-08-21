'use client'
import Link from 'next/link';
import Image from 'next/image';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { signInUser, signUpUser } from '@/lib/user-actions/authActions';

const signInSchema = z.object({
    email: z.email("Invalid email.").min(1, "Email is required."),
    password: z.string().min(6, 'Password must be at least 6 characters.'),
})

const signUpSchema = z.object({
    name: z.string().min(4, "Name is required."),
    email: z.email("Invalid email.").min(1, "Email is required."),
    password: z.string().min(6, 'Password must be at least 6 characters.'),
})

type SignInType = z.infer<typeof signInSchema>;
type SignUpType = z.infer<typeof signUpSchema>;
type AuthFormType = SignInType | SignUpType;

const AuthForm = ({type} : {type : "sign-in" | "sign-up"}) => {

    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<AuthFormType>({
        resolver: zodResolver(type === 'sign-in' ? signInSchema : signUpSchema),
        defaultValues: type === 'sign-in' 
            ? {email: '', password: ''}
            : {name: '', email: '', password: ''},
    })

    const onSubmit = async (data : AuthFormType) => {
        setIsLoading(true);
        try {
            const userInfo = data as CreateUserInfo | SignInUserInfo;
            const result = type === 'sign-up'
                ? await signUpUser(userInfo as CreateUserInfo)
                : await signInUser(userInfo as SignInUserInfo);

            if(result){
                console.log(result);
                router.push('/');
            }
        } catch (error) {
            console.error(error);
        }finally{
            setIsLoading(false);
        }
    }

    return (
        <div>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                {type === 'sign-up' && (
                    <>
                        <input 
                            type="text" 
                            placeholder='Name'
                            {...form.register('name')}
                        />
                        {'name' in form.formState.errors && (
                            <p>{form.formState.errors.name?.message}</p>
                        )}
                    </>
                )}

                <input 
                    type="email" 
                    placeholder='Email'
                    {...form.register('email')}
                />
                {form.formState.errors.email && (
                    <p>{form.formState.errors.email?.message}</p>
                )}

                <input 
                    type="password" 
                    placeholder='Password'
                    {...form.register('password')}
                />
                {form.formState.errors.password && (
                    <p>{form.formState.errors.password?.message}</p>
                )}

                <button type='submit' disabled={isLoading}>
                    {isLoading ? "Loading..." : type === 'sign-in' ? "Sign In" : "Sign Up"}
                </button>

            </form>
        </div>
    )
}

export default AuthForm
