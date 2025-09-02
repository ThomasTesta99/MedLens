
import Upload from '@/components/Upload'
import { getUserSession } from '@/lib/user-actions/authActions'
import React from 'react'

const page = async () => {
  const session = await getUserSession();
  const user = session?.user
  if(!user) return;
  return (
    <div className='p-6 pr-7'>
      <Upload user = {user}/>
    </div>
  )
}

export default page
