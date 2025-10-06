'use client'
import { checkRate, sendEmailVerification } from '@/lib/user-actions/authActions';
import { User } from '@/types/types';
import React, { useState } from 'react'

const VerifyEmail = ({user}: {user: User}) => {
    const [error, setError] = useState<string | null>(null);
    const handleVerifyEmail = async () => {
        try {
            if(user.emailVerified){
                setError("Email already verified")
                return;
            }
            const email = user.email;

            const rateLimit = await checkRate(email, "verify-email");

            if(!rateLimit.valid){
                setError(rateLimit.message);
                return;
            }

            const result = await sendEmailVerification({email: email, url: `${window.location.origin}/email-verified`});
            if(!result.success){
                console.log(result.message);
                setError(result.message);
            }
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div>
            {error && (
                <p className="mt-2 text-red-400">{error}</p>
            )}
            <button className="mb-2 mt-2 btn-ghost" onClick={handleVerifyEmail}>Verify Email</button>
        </div>
    )
}

export default VerifyEmail
