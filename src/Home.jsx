import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from './Components/Navbar'

function Home() {
  const [menu, setMenu] = useState()
  return (
    <div className=''>
      <Navbar />
      <div className="land">
        <div>The super fast color pallettes Generator</div>
        <span className="cont">Get inspired by thousands of color schemes and start creating now</span>
          <Link to={'/Quolors/Generate'}>
            <button>
              Start Your Generator!
            </button>
          </Link>
      </div>
    </div>
  )
}

export default Home
