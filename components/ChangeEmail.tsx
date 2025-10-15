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
                <div className="modal-overlay">
                    <div className="modal-bg">
                        <div className="modal-card">
                            <h2 className="change-title">
                                Change Email
                            </h2>
                            <p className="mt-2 text-sm text-gray-600">
                                Please enter your new email below.
                            </p>

                            <label className="change-label">
                                New Email
                                <input 
                                    type="text" 
                                    className="change-input"
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)} 
                                />
                            </label>

                            {error && (
                                <p className="error-text">{error}</p>
                            )}

                            {success && (
                                <p className="success-text">A confirmation link has been sent to your current email. Please check your inbox and click the link to approve the change. Once approved, your account email will be updated.</p>
                            )}

                            <div className="mt-6 flex flex-row justify-end">
                                <button 
                                    className="close-cancel-button"
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
                                        className="change-button"
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
