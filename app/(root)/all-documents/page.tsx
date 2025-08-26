import { getUserSession } from '@/lib/user-actions/authActions'
import React from 'react'

const page = async () => {
    const session = await getUserSession();
    const user = session?.user;

    if(!user) {
        return(
            <div>
                No User Documents found
            </div>
        )
    }
    return (
        <div>
            all docs for {user.name}
        </div>
    )
}

export default page
