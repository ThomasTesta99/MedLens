'use client'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'

const Topbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    const menuToggle = () => setMenuOpen((prev) => (!prev))

    return (
        <div className="text-3xl h-full w-full flex flex-row items-center p-10 justify-between">
            <Link href="/">
                <h1>MedLens</h1>
            </Link>

            <button className='cursor-pointer'>
                <Image 
                    src="/icons/menu.svg"
                    width={24}
                    height={24}
                    alt='menu'
                    className='invert'
                />
            </button>
        </div>
    )
}

export default Topbar
