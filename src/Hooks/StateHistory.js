import React, { useCallback, useRef, useState } from 'react'


const StateHistory = (defaultvalue) => {

    const [value, setValue] = useState(defaultvalue)

    const history = useRef([value])

    const pointer = useRef(0)

    const set = useCallback(
        v => {
            const res = typeof v === 'function' ? v(value) : v
            if (history.current[pointer.current] !== res) {
                if (pointer.current < history.current.length - 1) {
                    history.current.splice(pointer.current + 1)
                }
                history.current.push(res)
                pointer.current = history.current.length - 1
            }
            setValue(res)
        },
        [value]
    )

    const back = useCallback(() => {
        if (pointer.current <= 0) return
        pointer.current--
        setValue(history.current[pointer.current])
    }, [])

    const forwards = useCallback(() => {
        if (pointer.current >= history.current.length) return
        pointer.current++
        setValue(history.current[pointer.current])
    }, [])

    return [
        value,
        set, 
        {
            history: history.current,
            pointer: pointer.current,
            back,
            forwards,
        }
    ]

}

export default StateHistory
