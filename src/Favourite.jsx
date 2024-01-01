import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { allh } from './Generate'
import { FaCopy, FaMinus, FaArrowLeft, FaTrash } from 'react-icons/fa'
import { IoCopy } from 'react-icons/io5'

function Favourite() {
  const items = useRef([])

  const [loc, setLoc] = useState(true)

  const [fog, setFOG] = useState(true)

  var key = {}

  useEffect(() => {
    const all = document.querySelectorAll(".fav")
    if (localStorage.hex[0] == null) {
      //localStorage.hex.splice(0, 1)
      if (all.length == 0) {
        setLoc(false)
      }
      all.forEach(item => item.remove())
      setLoc(false)
    }
  })

  var obj;

  const fav = () => {

    if (localStorage.length > 0) {
      if (localStorage.hex.charAt(0) == ',') {
        key[0] = localStorage.hex.split(',')
      }
      key[0] = localStorage.hex.split(',')
    } else {
      localStorage.setItem('hex', '')
      key[0] = localStorage.hex.split(',')
    }
    obj = new Object()
    for (let i = 0; i < key[0].length; i++) {
      var hex = key[0][i]
      var hexe = 'hex' + key[0][i]
      obj[hexe] = hex
    }
    console.log();
  }

  const copyToClipboard = (hex) => {
    const el = document.createElement('textarea');
    el.value = hex;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    const selected =
      document.getSelection().rangeCount > 0
        ? document.getSelection().getRangeAt(0)
        : false;
    el.select();
    const success = document.execCommand('copy');
    document.body.removeChild(el);
    if (selected) {
      document.getSelection().removeAllRanges();
      document.getSelection().addRange(selected);
    }
    return success;
  }

  fav()

  const removeit = (hex) => {
    let hexe = 'hex' + hex
    delete obj[hexe]
    let item = key[0].indexOf(hex)
    key[0].splice(item, 1)

    localStorage.setItem('hex', Object.values(obj))
    const idit = `#hex` + hex
    let it = document.querySelector(idit)
    it.remove()
  }

  const cle = () => {
    localStorage.clear()
    const all = document.querySelectorAll(".fav")
    all.forEach(item => item.remove())
  }
  return (
    <>
      <div className="head">
        <Link to={'/Quolors/Generate'} className='ar'><FaArrowLeft size={30} /></Link>
        <div className="deleteAll" onClick={() => cle()}><FaTrash size={25} /></div>
        <div className="favh brand">FAVOURITES</div>
      </div>
      {loc ?
        <>
          <div className='cont'>
            {
              Object.values(obj).map((item, key) => {
                return (
                  <div className="fav" key={key} id={`hex${item}`} style={{ background: `#${item}` }}>
                    <div className="end">
                      {item}
                    </div>
                    <div className="options">
                      <div className="round" onClick={() => copyToClipboard(item)}><IoCopy /></div>
                      <div className="round" onClick={() => removeit(item)}><FaMinus /></div>
                    </div>
                  </div>

                )
              })
            }
          </div>
        </> :
        <h1>There is NOTHING Here......</h1>}


    </>
  )
}

export default Favourite
