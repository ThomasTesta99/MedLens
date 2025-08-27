import { getUserSession } from '@/lib/user-actions/authActions'
import { getUserDocuments } from '@/lib/user-actions/documents';
import React from 'react'

const page = async () => {
    const session = await getUserSession();
    const user = session?.user;


    if(!user) {
        return(
            <div>
                No User found
            </div>
        )
    }
    const result = await getUserDocuments({userId: user.id});
    if(!result.success || !result.documents){
        return(
            <div>
                No User Documents found
            </div>
        )
    }

    const documents = result.documents;

    return (
        <div>
            {documents[0].title}
            {documents[0].ownerId}
        </div>
    )
}

export default page
