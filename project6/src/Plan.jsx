import React from 'react'
import ReactDOM from 'react-dom/client'
import Year from './Year'

function Plan(plan) {
    // build years
    return (
        <>
            {plan.years.map(year => <><Year year={year} plan={plan} /></>)}
        </>
    )
}

export default Plan