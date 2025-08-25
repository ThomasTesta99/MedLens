'use client'
import { menuBarLinks } from '@/constants'
import { signOutUser } from '@/lib/user-actions/authActions'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React, { useState } from 'react'

const Topbar = ({user} : UserProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(v => !v);
  const router = useRouter();
  const pathName = usePathname();

  const signOut = async () => {
    await signOutUser();
    router.push('/sign-in');
  }

  return (
    <>
      <div className="topbar">
        <Link href="/"><h1>MedLens</h1></Link>
        <button onClick={toggleMenu} className="topbar-menu-btn">
          <Image src="/icons/menu.svg" width={24} height={24} alt="menu" className="icon-invert" />
        </button>
      </div>

      <div
        onClick={() => setMenuOpen(false)}
        className={`menu-overlay ${menuOpen ? 'menu-overlay--open' : 'menu-overlay--closed'}`}
      />

      <aside
        className={`menu ${menuOpen ? 'menu--open' : 'menu--closed'}`}
      >

        <div className='text-2xl'>
            <button
                onClick={() => setMenuOpen(false)}
                className="menu-close-btn"
                aria-label="Close menu"
            >
                <Image src="/icons/close.svg" width={24} height={24} alt="close" className="icon-invert" />
            </button>
            <h1>Menu</h1>
        </div>

        <nav className="menu-body">
          <ul className="menu-list">
            {menuBarLinks.map(link => {
              const isActive = pathName === link.route || pathName.startsWith(`${link.route}/`);
              return (
                <li key={link.label}>
                  <Link
                    href={link.route}
                    onClick={() => setMenuOpen(false)}
                    className={`menu-link ${isActive ? 'menu-link--active' : ''}`}
                  >
                    <Image src={link.imgUrl} alt={link.label} width={20} height={20} className="menu-link-icon" />
                    <span className="menu-link-label">{link.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="footer">
            <div className={`footer-name ${user?.image ? 'bg-transparent' : 'bg-gray-600'}`}>
                {user?.image ? (
                <Image
                    src={user.image}
                    alt="User image"
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                />
                ) : (
                <p className="text-xl font-bold text-white">{user?.name?.[0] ?? ' '}</p>
                )}
            </div>

            <div className="footer-email">
                <h1 className="text-sm truncate font-semibold text-white">{user?.name ?? ' '}</h1>
                <p className="text-sm truncate font-normal text-gray-300">{user?.email ?? ' '}</p>
            </div>

            <button className="footer-image" onClick={signOut}>
                <Image src="/icons/logout.svg" width={24} height={24} alt="logout" className="icon-logout" />
            </button>
        </div>


      </aside>
    </>
  )
}

export default Topbar
