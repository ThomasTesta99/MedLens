'use client'
import { deleteUserAccount } from '@/lib/user-actions/authActions'
import { deleteDocumentData, getUserDocuments } from '@/lib/user-actions/documents'
import { User } from '@/types/types'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const DangerAction = ({user, type} : {user: User, type : "account" | "documents"}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmDocumentDelete, setConfirmDocumentDelete] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const deleteDocuments = async () => {
        setIsLoading(true);
        try {
            const result = await getUserDocuments({userId: user.id});
            if(!result.success){
                console.log(result.message + result.error as string);
                setError(result.message + result.error as string);
                return;
            }

            const userDocuments = result.documents;

            if(userDocuments?.length == 0){
                if(type === "documents"){
                    setError("No User Documents");
                }
                return;
            }

            for(const doc of userDocuments!){
                const id = doc.id;
                const result = await deleteDocumentData({documentId: id});

                if(!result.success){
                    console.log(result.message);
                    setConfirmDocumentDelete(false);
                    setShowModal(false);
                    setError(result.message);
                }else{
                    console.log("Document Deleted")
                    setError(null);
                }
            }
            
        } catch (error) {
            console.log(error);
            setError(error as string);
        }finally{
            setIsLoading(false);
        }
    }

    const deleteAccount = async () => {
        setIsLoading(true);
        setError(null);
        try {
            await deleteDocuments();
            const deleteAccountSuccess = await deleteUserAccount({password});

            if(!deleteAccountSuccess.success){
                setError(deleteAccountSuccess.message);
                return;
            }
            setPassword('');
            setConfirmDocumentDelete(false);
            setShowModal(false);
            router.refresh();
        } catch (error) {
            console.log(error);
        }finally{
            setIsLoading(false);
        }
    }

    const openModal = () => setShowModal(true);

    const primaryAction = type === "account" ? deleteAccount : deleteDocuments;
    const primaryDisabled = isLoading || (type === "account" ? password.length === 0 : !confirmDocumentDelete);

    return (
        <div>
            <button className="mb-2 mt-2 text-red-400 btn-ghost" onClick={openModal}>
                {type === "account" ? "Delete Account" : "Delete Documents"}
            </button>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="fixed inset-0 bg-black/60 p-6 rounded-2xl"> 
                        <div className="relative z-10 w-full max-w-md rounded-2xl bg-white shadow-xl p-3">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Confirm {type === "account" ? "Account" : "All Documents"} Deletion
                            </h2>
                            <p className="mt-2 text-sm text-gray-600">
                                {type === "account" ?
                                    "This will permanently delete your account and all associated data. Please enter your password to continue."
                                    : "This will permanelty delete all of your documents and their associated data."
                                }
                            </p>

                            {type === "account" ? (
                                <label className="mt-4 block text-sm font-medium text-gray-700">
                                    Password
                                    <input 
                                        type="password" 
                                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring" 
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={isLoading}
                                    />
                                </label>
                            ): (<label className="mt-4 flex items-start gap-2 text-sm text-gray-700">
                                    <input 
                                        type="checkbox" 
                                        className="mt-1 h-4 w-4" 
                                        checked={confirmDocumentDelete}
                                        onChange={(e) => setConfirmDocumentDelete(e.target.checked)}
                                        disabled={isLoading}
                                    />
                                    <span>I understand this will permanently delete <strong>all</strong> my documents and generated data.</span>
                                </label>)}
                            
                            {error && (
                                <p className="mt-2 text-red-600 font-semibold">{error}</p>
                            )}

                            <div className="mt-6 flex items-center justify-end gap-3">
                                <button 
                                    className="rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer" 
                                    onClick={() => {
                                        setShowModal(false); 
                                        setPassword("");
                                        setError(null);
                                        setConfirmDocumentDelete(false);
                                    }} 
                                    disabled={isLoading}
                                >
                                    Cancel
                                </button>
                                <button 
                                    className="rounded-lg bg-red-600 px-4 py-2 cursor-pointer hover:bg-red-700 disabled:opacity-50" 
                                    onClick={primaryAction}
                                    disabled={primaryDisabled}
                                >
                                    {isLoading ? 'Deleting...' : type === "account" ? "Delete Account" : "Delete Documents"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default DangerAction
