'use client'
import { checkRate, getUserByEmail, sendResetPasswordEmail } from '@/lib/user-actions/authActions';
import React, { useState } from 'react'

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            const userResult = await getUserByEmail({email});

            if(!userResult.user){
                throw new Error("Failed to send link");
            }

            const rateLimit = await checkRate(email, "password-reset");
            if(!rateLimit.valid){
                throw new Error(rateLimit.message);
            }

            const redirectTo = `${window.location.origin}/reset-password`;
            const result = await sendResetPasswordEmail({email, url: redirectTo});
            if(!result.success){
                throw new Error(result.message);
            }else{
                console.log("Reset link sent. Please check your email");
            }

        } catch (error) {
            console.log(error);
        }finally{
            setIsSubmitting(false);
        }
    }

    return (
        <div className='auth-card'>
            <h1 className="auth-header">Forgot Password</h1>
            <p className="text-slate-300 text-lg text-center mt-4">Please enter your email to reset your password</p>

            <form onSubmit={handleSubmit} className="auth-form">
                <input 
                    type="email" 
                    className="auth-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder='Email'
                />

                <button 
                    className="auth-submit"
                    type='submit'
                    disabled={isSubmitting}
                >
                        {isSubmitting ? "Sending..." : "Send Reset Link"}
                </button>

            </form>
            <p className="auth-footer">
                Remembered your password?{' '}
                <a href="/sign-in" className="auth-link">Go back to login</a>
            </p>
        </div>
    )
}

export default ForgotPassword
