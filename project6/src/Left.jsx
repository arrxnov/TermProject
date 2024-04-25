import React from 'react'
import ReactDOM from 'react-dom/client'
import Requirements from './Requirements'
import Special from './Special'

function Left(studentId) {
    return (
        <>
            <Requirements />
            <Special />
        </>
    )
}
export default Left