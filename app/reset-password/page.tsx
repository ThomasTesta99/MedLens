import ResetPassword from '@/components/ResetPassword'
import React, { Suspense } from 'react'

const page = () => {
    return (
        <div className='auth-wrapper'>
            <Suspense fallback={<div>Loading...</div>}>
                <ResetPassword />
            </Suspense>
        </div>
    )
}

export default page
