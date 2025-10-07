'use client'
import { changeEmailRequest, checkRate } from '@/lib/user-actions/authActions';
import { User } from '@/types/types'
import React, { useState } from 'react'

function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

const ChangeEmail = ({user} : {user: User}) => {
    const [newEmail, setNewEmail] = useState("");
    const [showModal, setShowModal] = useState(false);

    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const openModal = () => setShowModal(!showModal);
    const buttonDisabled = isLoading || newEmail == "" || !isValidEmail(newEmail);

    const handleChangeEmail = async () => {
        setIsLoading(true);
        setError(null);
        try {

            const checkLimit = await checkRate(user.email, 'change-email');

            if(!checkLimit.valid){
                setError(checkLimit.message);
                return;
            }

            const result = await changeEmailRequest({newEmail});
            if(!result.success){
                setError(result.message);
                return;
            }
            setSuccess(true);
        } catch (error) {
            console.log(error);
            setError(error as string);
        }finally{
            setIsLoading(false);
        }
    }
    
    return (
        <div>
            <button className="btn-ghost mb-2 mt-2" onClick={openModal}>Change Email</button>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="fixed inset-0 bg-black/60 p-6 rounded-2xl">
                        <div className="relative z-10 w-full max-w-md rounded-2xl bg-white shadow-xl p-3">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Change Email
                            </h2>
                            <p className="mt-2 text-sm text-gray-600">
                                Please enter your new email below.
                            </p>

                            <label className="mt-4 block text-sm font-medium text-gray-700">
                                New Email
                                <input 
                                    type="text" 
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring"
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)} 
                                />
                            </label>

                            {error && (
                                <p className="mt-2 text-red-600 font-semibold">{error}</p>
                            )}

                            {success && (
                                <p className="mt-2 text-green-400 font-semibold">A confirmation link has been sent to your current email. Please check your inbox and click the link to approve the change. Once approved, your account email will be updated.</p>
                            )}

                            <div className="mt-6 flex flex-row justify-end">
                                <button 
                                    className="mt-2 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => {
                                        setError(null);
                                        setNewEmail("");
                                        setIsLoading(false);
                                        setShowModal(false);
                                        setSuccess(false);
                                    }}
                                >
                                    {success ? "Close" : "Cancel"}
                                </button>

                                {!success && (
                                    <button 
                                        className="rounded-lg bg-gray-600 px-4 py-2 text-white cursor-pointer hover:bg-gray-700 disabled:opacity-50"
                                        disabled={buttonDisabled}
                                        onClick={handleChangeEmail}
                                    >
                                    Change Email
                                </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ChangeEmail
