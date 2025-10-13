'use client'
import { checkRate, sendEmailVerification } from '@/lib/user-actions/authActions';
import React, { useState } from 'react'

const MustVerify = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [email, setEmail] = useState("");

    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setError(null);
        setSuccess(false);
        try {
            const rateLimit = await checkRate(email, "must-verify-email");
            console.log(rateLimit);
            if(!rateLimit.valid){
                setError(rateLimit.message);
                return;
            }

            const result = await sendEmailVerification({email: email, url: `${window.location.origin}/email-verified`});
            console.log(result)
            if(!result.success){
                console.log(result.message);
                setError(result.message);
            }
            setSuccess(true);
            console.log(success);
        } catch (error) {
            setError(error as string)
        }finally{
            setIsSubmitting(false);
        }

    }

    return (
        <div className='auth-card'>
                <h1 className="auth-header">Verify Email</h1>
                <p className="text-slate-300 text-lg text-center mt-4">Please verify your email to login</p>
                <p className="text-slate-200 text-sm text-center mt-8">Need another verification link? Enter your email to resend.</p>

                
                <div className="auth-form">
                    <input
                        type="email"
                        className="auth-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder='Email'
                    />

                    {error && (
                        <p className="text-red-500 mt-2">{error}</p>
                    )}

                    {success && (
                        <p className="text-green-400 mt-2">Please check your email. If an account with this email exists, a verification email was sent.</p>
                    )}


                    <button
                        className="auth-submit"
                        type='submit'
                        disabled={isSubmitting}
                        onClick={() => {
                            handleSubmit()
                        }}
                    >
                            {isSubmitting ? "Sending..." : "Send Verification Link"}
                    </button>
                </div>


                {/* <p className="auth-footer">
                    Remembered your password?{' '}
                    <a href="/sign-in" className="auth-link">Go back to login</a>
                </p> */}
            </div>
    )
}

export default MustVerify
