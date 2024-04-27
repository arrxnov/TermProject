import React from 'react'
import ReactDOM from 'react-dom/client'
import Requirements from './Requirements'
import Special from './Special'

function Left({reqs}) {
    return (
        <div id="leftContainer">
            <Requirements reqs={reqs}/>
            <Special />
        </div>
    )
}
export default Left