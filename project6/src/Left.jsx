import React from 'react'
import ReactDOM from 'react-dom/client'
import Requirements from './Requirements'
import Special from './Special'

function Left({reqs}) {
    return (
        <>
            <Requirements reqs={reqs}/>
            <Special />
        </>
    )
}
export default Left