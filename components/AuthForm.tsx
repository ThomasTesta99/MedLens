'use client'
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { signInUser, signUpUser } from '@/lib/user-actions/authActions';
import Link from 'next/link';

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
        let navigated = false;
        try {
            const userInfo = data as CreateUserInfo | SignInUserInfo;
            const result = type === 'sign-up'
                ? await signUpUser(userInfo as CreateUserInfo)
                : await signInUser(userInfo as SignInUserInfo);

            if(result){
                navigated = true;
                console.log(result);
                router.prefetch("/")
                router.push('/');
            }else{
                setIsLoading(false);
            }
        } catch (error) {
            console.error(error);
            setIsLoading(false);
        }finally{
            if(!navigated) setIsLoading(false);
        }
    }

    return (
        <div className='auth-card'>


            <div className='mb-6 text-center'>
                <h1 className='auth-header'>MedLens</h1>
                <h2 className='auth-subtitle'>{type === 'sign-in' ? "Sign In" : "Sign Up"}</h2>
            </div>


            <form onSubmit={form.handleSubmit(onSubmit)} className='auth-form'>
                {type === 'sign-up' && (
                    <>
                        <input 
                            type="text" 
                            placeholder='Name'
                            {...form.register('name')}
                            className='auth-input'
                        />
                        {'name' in form.formState.errors && (
                            <p className='auth-error'>{form.formState.errors.name?.message}</p>
                        )}
                    </>
                )}

                <input 
                    type="email" 
                    placeholder='Email'
                    {...form.register('email')}
                    className='auth-input'
                />
                {form.formState.errors.email && (
                    <p className='auth-error'>{form.formState.errors.email?.message}</p>
                )}

                <input 
                    type="password" 
                    placeholder='Password'
                    {...form.register('password')}
                    className='auth-input'
                />
                {form.formState.errors.password && (
                    <p className='auth-error'>{form.formState.errors.password?.message}</p>
                )}

                <button type='submit' disabled={isLoading} className='auth-submit'>
                    {isLoading ? "Loading..." : type === 'sign-in' ? "Sign In" : "Sign Up"}
                </button>

            </form>

            <div className="auth-footer">
                {type === 'sign-in' ? `Don't have an account? ` : `Already have an account? `}
                <Link href={type === 'sign-in' ? '/sign-up' : '/sign-in'} className="auth-link">
                    {type === 'sign-in' ? 'Sign Up' : 'Sign In'}
                </Link>
            </div>

        </div>
    )
}

export default AuthForm
