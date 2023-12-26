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
    var key = {}
    
    if (!localStorage.length == 0) {
        key[0] = localStorage.hex.split(',')
        allh = key[0]
    } else {
        allh = []
    }

    useEffect(() => {
        Generate()
        var elem = document.getElementById("map")
        new Sortable(elem, {
            animation: 200,
            handle: '.sort',
            chosenClass: 'setup',
            dragClass: 'setu',
            ghostClass: 'set'
        })
    }, [])

    const [clicked, setClicked] = useState(false)
    
    const [add, setAdd] = useState(false)

    const [limit, setLimit] = useState([0, 1, 2, 3, 4])

    const all = useRef([])

    const left = useRef(0)

    const arr = useRef([])

    const Generate = () => {
        var ar = [];
        limit.forEach(l => {
            var random = uniqolor.random()
            arr.current = random
            var r = Object.entries(arr.current)
            ar.push(r)
        })
        setCount(ar)
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

    var [count, setCount, { history, pointer, back, forwards }] = StateHistory([], 5)

    const b = () => {
        left.current--
        pointer = left.current
    }
    const f = () => {
        left.current++
        pointer = left.current
    }

    return (
        <div className='gen'>
            <Navbar />
            <div id="map">
                {history[pointer].map((c, key) => {
                    const hexVal = c[0][1].split('#')
                    const coVal = c[1][1]
                    const copId = `copy${key}`
                    const itId = `item${key}`
                    return (
                        <div id={itId} key={key} style={{ color: !c[1][1] ? 'white' : 'black', background: c[0][1] }} className="item">
                            {hexVal}
                            <div className="icons">
                                <div className="sort">
                                    <FaArrowsAltV />
                                </div>
                                <div className="copy">
                                    <IoCopyOutline id={copId} onClick={() => {
                                        copyToClipboard(hexVal[1])
                                        setClicked(true)
                                        setTimeout(() => {
                                            setClicked(false)
                                        }, 2000)
                                    }} />
                                </div>
                                <div className="like" onClick={() => {
                                        favouriteList(hexVal[1])
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
                <button className="btn" onClick={() => Generate()}>Generate</button>

                <button disabled={left.current <= 3 ? true : false} className="btn arr" onClick={() => {
                    back()
                    b()
                }} title='Back'><BsArrow90DegLeft /></button>

                <button disabled={left.current == history.length ? true : false} className="btn arr" onClick={() => {
                    forwards()
                    f()
                }} title='Forwards'><BsArrow90DegRight /></button>
                <div className="favourite" title='Favourites'>
                    <Link to={'/Quolors/Favourite'}><FiHeart /></Link>
                </div>
            </div>
        </div>
    );



};

export default Generate;
