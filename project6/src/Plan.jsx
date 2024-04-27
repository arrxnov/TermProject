import React from 'react'
import ReactDOM from 'react-dom/client'
import Year from './Year'

function Plan({studentinfo, plancourses}) {
    // build years
    let years = [
        "2021",
        "2022",
        "2023",
        "2024"
    ];
    
    return (
        <div id="plan">
            {years.map(year => <><Year year={year} plancourses={plancourses} /></>)}
        </div>
    )
}

export default Plan