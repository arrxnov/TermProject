import React from 'react'
import ReactDOM from 'react-dom/client'
import Semester from './Semester'

function Year({year, plancourses}) {
    return (
        <div id={"year" + year} className="year">
            <Semester year={parseInt(year)} term="Fall" courses={plancourses} />
            <Semester year={parseInt(year) + 1} term="Spring" courses={plancourses} />
            <Semester year={parseInt(year) + 1} term="Summer" courses={plancourses} />
        </div>
    )
}

export default Year