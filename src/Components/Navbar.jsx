import React, { useState } from 'react'
import { Link } from 'react-router-dom'

import { FaArrowsAltV, FaBars, FaTimes, FaHeart } from 'react-icons/fa'

function Navbar() {
  const [open, setOpen] = useState(false)

  const menu = () => {
      setOpen(!open)
  }

  const linkstyles = {
      color: 'Black',
      textDecoration: 'none'
  }


  return (
    <div className=''>
      <div className="navbar">
                <div className="brand">Quolors</div>
                <div className="menu"><FaBars onClick={menu} /></div>
                <>
                    <div className={open ? 'bg' : ''} onClick={menu}></div>
                    <div className={open ? 'side' : 'slide'}>
                        <div className="close"><FaTimes onClick={menu} /></div>
                        <ul>
                            <Link style={linkstyles} to={'/'}><li>Home</li></Link>
                            <Link style={linkstyles} to={'/Generate'}><li>Start Generator</li></Link>
                            <Link style={linkstyles} to={'/Favourite'}><li>Favourites</li></Link>
                        </ul>
                    </div>
                </>

            </div>
    </div>
  )
}

export default Navbar