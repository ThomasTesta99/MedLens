'use client'
import { checkRate, getUserByEmail, sendResetPasswordEmail } from '@/lib/user-actions/authActions';
import React, { useState } from 'react'

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        try {
            const userResult = await getUserByEmail({email});

            if(!userResult.user){
                setError("Failed to send link");
            }

            const rateLimit = await checkRate(email, "password-reset");
            if(!rateLimit.valid){
                setError("Failed to send link. Please try again in a few minutes");
                return;
            }

            const redirectTo = `${window.location.origin}/reset-password`;
            const result = await sendResetPasswordEmail({email, url: redirectTo});
            if(!result.success){
                setError(result.message);
            }else{
                setSuccess(true);
            }

        } catch (error) {
            setError(error as string);
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

                {success && (
                    <p className="text-green-400 mt-2 text-sm">Reset link sent. Please check your email</p>
                )}

                {error && (
                    <p className="text-red-400 mt-2 text-sm">{error}</p>
                )}

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
