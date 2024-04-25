import Plan from './Plan'
import Table from './Table'
import React from 'react'
import ReactDOM from 'react-dom/client'

function Right(studentId, planId) {
    return (
        <>
            <Plan studentId={studentId} planId={planId} />
            <Table />
        </>
    )
}
export default Right