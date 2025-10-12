'use client'
import { changePassword } from '@/lib/user-actions/authActions';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

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
                <div className="fixed inset-0 z-[100] flex justify-center items-center">
                    <div className="fixed inset-0 bg-black/60 rounded-2xl p-6">
                        <div className="relative z-[101] w-full max-w-md rounded-2xl bg-white shadow-xl p-3">
                            <h2 className='text-lg font-semibold text-gray-900'>Change Password</h2>
                            <p className="mt-2 text-sm text-gray-600">Please provide your old password to create a new one.</p>
                            <label className="mt-4 block text-sm font-medium text-gray-700">
                                Old Password
                                <input 
                                    type="password" 
                                    className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring text-black" 
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    disabled={isLoading}
                                />
                            </label>
                            
                            <label className="mt-4 block text-sm font-medium text-gray-700">
                                New Password
                                <input 
                                    type="password" 
                                    className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring text-black" 
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

                            <label className="mt-4 block text-sm font-medium text-gray-700">
                                Confirm New Password
                                <input 
                                    type="password" 
                                    className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring text-black" 
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
                                <p className="mt-2 text-red-600 font-semibold">{error}</p>
                            )}

                            <div className="mt-6 flex flex-row justify-end">
                                <button 
                                    className="mt-2 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
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
                                    className='rounded-lg bg-gray-600 px-4 py-2 text-white cursor-pointer hover:bg-gray-700 disabled:opacity-50'
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
