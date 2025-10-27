'use client'
import { changePassword } from '@/lib/user-actions/authActions';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { toast } from 'react-toastify';

const ChangePassword = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setshowModal] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    
    const handlePasswordChange = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await changePassword({oldPassword, newPassword});

            if(!result.success){
                setError(result.message);
                return;
            }else{
                console.log("Password Changed");
                setshowModal(false);          
                setOldPassword('');
                setNewPassword('');
                setConfirmNewPassword('');
                toast.success("Password successfuly changed.",{
                    autoClose: 5000
                });
                router.refresh();
            }
        } catch (error) {
            console.log(error);
            setError(error as string);
        }finally{
            setIsLoading(false);
        }
    }

    const openModal = () => setshowModal(true);

    const buttonDisabled = isLoading || newPassword.length === 0 || confirmNewPassword.length === 0 || newPassword != confirmNewPassword

    return (
        <div>
            <button className="mb-2 mt-2 btn-ghost" onClick={openModal}>Change Password</button>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-bg">
                        <div className="modal-card">
                            <h2 className='change-title'>Change Password</h2>
                            <p className="mt-2 text-sm text-gray-600">Please provide your old password to create a new one.</p>
                            <label className="change-label">
                                Old Password
                                <input 
                                    type="password" 
                                    className="change-input" 
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    disabled={isLoading}
                                />
                            </label>
                            
                            <label className="change-label">
                                New Password
                                <input 
                                    type="password" 
                                    className="change-input" 
                                    value={newPassword}
                                    onChange={(e) => {
                                        const value = e.target.value
                                        setNewPassword(value);
                                        if(confirmNewPassword && confirmNewPassword != value) {
                                            setError("Passwords must match.");
                                        }else {
                                            setError(null);
                                        }
                                    }}
                                    disabled={isLoading}
                                />
                            </label>

                            <label className="change-label">
                                Confirm New Password
                                <input 
                                    type="password" 
                                    className="change-input" 
                                    value={confirmNewPassword}
                                    onChange={(e) => {
                                        const value = e.target.value
                                        setConfirmNewPassword(value);
                                        if(newPassword != value){
                                            setError("Passwords must match.")
                                        }else{
                                            setError(null);
                                        }
                                    }}
                                    disabled={isLoading}
                                />

                            </label>

                            {error && (
                                <p className="error-text">{error}</p>
                            )}

                            <div className="mt-6 flex flex-row justify-end">
                                <button 
                                    className="close-cancel-button"
                                    onClick={() => {
                                        setError(null);
                                        setOldPassword("");
                                        setNewPassword("");
                                        setConfirmNewPassword("");
                                        setIsLoading(false);
                                        setshowModal(false);
                                    }}
                                >
                                    Cancel
                                </button>

                                <button 
                                    className='change-button'
                                    disabled={buttonDisabled}
                                    onClick={handlePasswordChange}
                                >
                                    {isLoading ? "Changing Password..." : "Change Password"}
                                </button>
                            </div>



                        </div>
                    </div>
                </div>
            )

            }
        </div>
    )
}

export default ChangePassword
