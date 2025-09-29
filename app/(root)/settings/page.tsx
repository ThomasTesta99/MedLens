import { getUserSession } from '@/lib/user-actions/authActions'
import React from 'react'
import { formatDate } from '../all-documents/page';
import DangerAction from '@/components/DangerAction';

const page = async () => {
    const session = await getUserSession();
    if(!session?.user){
        return (
            <div>You are not logged in</div>
        )
    }
    const user = session.user

    return (
        <main className='mx-auto max-w-4xl px-6 py-10 space-y-8'>
            <header>
                <h1 className="text-3xl font-semibold">Settings</h1>
                <p className="mt-2 text-slate-200">Manage your account and data</p>
            </header>

            <section className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
                <h2 className='text-xl font-bold'>Profile</h2>
                <div className='mt-4 grid gap-4 sm:grid-cols-2'>
                    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur px-4 ">
                        <p className='mt-2 text-slate-300'>Name</p>
                        <p className='mb-2 font-semibold'>{user.name}</p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur px-4 ">
                        <p className='mt-2 text-slate-300'>Email</p>
                        <p className='mb-2 font-semibold'>{user.email}</p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur px-4 ">
                        <p className='mt-2 text-slate-300'>Date Joined</p>
                        <p className='mb-2 font-semibold'>{formatDate(user.createdAt)}</p>
                    </div>

                   <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur px-4 ">
                        <p className='mt-2 text-slate-300'>Email Verified</p>
                        <p className='mb-2 font-semibold'>{user.emailVerified ? "True" : "False"}</p>
                    </div>
                </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
                <h2 className='text-xl font-bold'>Manage Account</h2>
                <div className='mt-4 grid gap-4 sm:grid-cols-2'>
                    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur px-4 ">
                       <p className='mt-2 font-semibold'>Change Password</p>
                       <p className='text-sm text-slate-400'>You must provide your old password in order to create a new one.</p>
                       <button className="mb-2 mt-2 btn-ghost">Change Password</button>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur px-4 ">
                        
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur px-4 ">
                        <p className='mt-2 font-semibold'>Delete All Documents</p>
                        <p className='text-sm text-slate-400'>Removes all uploaded files and generated data.</p>
                        <DangerAction user = {user} type = "documents"/>
                    </div>

                   <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur px-4 ">
                        <p className='mt-2 font-semibold'>Delete Account</p>
                        <p className='text-sm text-slate-400'>Permanently deletes your account and all associated data.</p>
                        <DangerAction user = {user} type = "account"/>

                    </div>
                </div>
            </section>

            
        </main>
    )
}

export default page
