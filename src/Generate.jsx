import React from 'react'
import { useState, useEffect, useRef } from 'react'
import './App.css'

import { Link } from 'react-router-dom'

/*React Icons*/
import { BsArrow90DegLeft, BsArrow90DegRight, BsDash } from 'react-icons/bs'
import { FaArrowsAltV, FaBars, FaTimes, FaHeart } from 'react-icons/fa'
import { FiHeart } from 'react-icons/fi'
import { BiSolidLockAlt, BiSolidLockOpenAlt } from 'react-icons/bi'
import { IoCopyOutline, IoHeart } from 'react-icons/io5'
import { IoMdHeart, IoMdHeartEmpty } from 'react-icons/io'

/*Hooks*/
import StateHistory from './Hooks/StateHistory';

/* Random Color */
import uniqolor from 'uniqolor';
import Navbar from './Components/Navbar'


export var allh = []


function Generate() {
    useEffect(() => {
        var elem = document.getElementById("map")
        new Sortable(elem, {
            animation: 200,
            handle: '.sort',
            chosenClass: 'setup',
            dragClass: 'setu',
            ghostClass: 'set'
        })
    }, [])

    var [count, setCount, { history, pointer, back, forwards }] = StateHistory([], 5)

    const left = useRef(0)

    const [arr, setArr] = useState([])

    const [add, setAdd] = useState(false)
    
    const [dat, setDat] = useState({})

    const ar = useRef([])

    const handleGenerate = async (event) => {
        var genarr = []
        var len = 5
        for (let i = 0; i < len; i++) {
            try {
                const first = await fetch("https://x-colors.yurace.pro/api/random")
                const data = await first.json()
                setDat({ ...dat, ...data })
                const hex = data.hex.split('#')[1]
                const second = await fetch(`https://www.thecolorapi.com/id?hex=${hex}`)
                const secData = await second.json()
                ar.current = secData
                genarr.push(ar.current)
            } catch (error) {
                console.log(error);
            }

        }
            setCount(genarr)
            setArr(history[pointer])
        console.log(history);

        left.current = history.length
    }

    const copyToClipboard = (hex) => {

        let f = document.createElement('span')
        f.textContent = 'Copied To Clipboard!'
        f.classList.add('popup')
        setTimeout(() => {
            f.remove()
        }, 2000);
        const body = document.querySelector('.pop')
        body.appendChild(f)


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

    const favouriteList = (hex) => {
        let f = document.createElement('span')
        f.textContent = 'Added To Favourites!'
        f.classList.add('popup')
        setTimeout(() => {
            f.remove()
        }, 2000);
        const body = document.querySelector('.pop')
        body.appendChild(f)

        if (localStorage.hex.length == 0) {
            allh = []
        }
        localStorage.clear()
        allh.push(hex)
        if (allh[0] == '') {
            allh.splice(0, 1)
        }
        setAdd(false)
        localStorage.setItem('hex', allh)
    }

    const del = (id) => {
        let i = document.querySelectorAll('.item')
        let item = document.querySelector(`#${id}`)
        item.remove()
        if (i.length <= 2) {
            let ite = document.querySelector('.icons .del')
            ite.style.display = 'none'
        }
    }

    const b = () => {
        left.current--
        pointer = left.current
    }

    const f = () => {
        left.current++
        pointer = left.current
    }

    useEffect(() => {
        window.addEventListener('resize', () => {
            const viewport = window.innerHeight

            console.log(viewport);
        })
    })

    const heightStyles = {
        height: `${window.innerHeight}px`
    }
    const smallStyles = {
        height: `${window.innerHeight - 100}px`
    }

    return (
        <div className='gen' style={heightStyles}>
        <Navbar />
            <div id="map" style={smallStyles}>
                {history[pointer].map((c, key) => {
                     const copId = `copy${key}`
                     const itId = `item${key}`
                    return (
                        <div id={itId} key={key} style={{ background: c.hex.value, color: c.contrast.value }} className="item">
                            {c.hex.value}
                             <div className="icons">
                                 <div className="sort">
                                     <FaArrowsAltV />
                                 </div>
                                 <div className="copy">
                                     <IoCopyOutline id={copId} onClick={() => {
                                         copyToClipboard(c.hex.clean)
                                         setClicked(true)
                                         setTimeout(() => {
                                             setClicked(false)
                                         }, 2000)
                                     }} />
                                 </div>
                                 <div className="like" onClick={() => {
                                         favouriteList(c.hex.clean)
                                         setAdd(true)
                                         setTimeout(() => {
                                             setAdd(false)
                                         }, 2000)
                                     }}>
                                     <IoMdHeartEmpty />
                                 </div>
                                 <div className="del" onClick={() => {
                                     del(itId)
                                 }}>
                                     <FaTimes />
                                 </div>
                             </div>
                        </div>
                    )
                })}
            </div>

            <div className="pop"></div>

            <div className="controls">
                <button className="btn btg" onClick={() => handleGenerate()}>Generate</button>

                <button disabled={left.current <= 2 ? true : false} className="btn arr" onClick={() => {
                    back()
                    b()
                }} title='Back'><BsArrow90DegLeft /></button>

                <button disabled={left.current == history.length ? true : false} className="btn arr" onClick={() => {
                    forwards()
                    f()
                }} title='Forwards'><BsArrow90DegRight /></button>
                <div className="favourite" title='Favourites'>
                    <Link to={'/Favourite'}><FiHeart /></Link>
                </div>
            </div>
        </div>
    );



};

export default Generate;
