'use client'
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react'

const ResetPassword = () => {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const router = useRouter();


    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [passwordsMatch, setPasswordsMatch] = useState(true);

    const inputBorderClass = () => 
        confirmPassword === ""
        ? ''
        : passwordsMatch
        ? 'border-green-500'
        : 'border-red-500';
    

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        console.log("WOrked");

    }
    return (
        <div className='auth-card'>
            <h1 className="auth-header">Set New Password</h1>
            <p className="text-slate-300 text-lg text-center mt-4">Enter your new password below</p>

            <form onSubmit={handleSubmit} className="auth-form">
                <input
                    type="password"
                    placeholder="New password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="auth-input"
                />
                <input
                    type="password"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className={`auth-input mt-2 ${inputBorderClass()}`}
                />
                {!passwordsMatch && confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
                )}
                {passwordsMatch && confirmPassword && (
                    <p className="text-green-500 text-sm mt-1">Passwords match</p>
                )}
                <button
                    type="submit"
                    disabled={isSubmitting || password != confirmPassword}
                    className="auth-submit mt-4"
                >
                    {isSubmitting ? 'Resetting...' : 'Reset Password'}
                </button>
            </form>
            <p className="auth-footer">
                Know your password?{' '}
                <a href="/login" className="auth-link">
                    Go back to login
                </a>
            </p>
        </div>
  )
}

export default ResetPassword
