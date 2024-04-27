import React from 'react'
import ReactDOM from 'react-dom/client'
import Semester from './Semester'

function Year({year, plancourses, totalCredits, setTotalCredits}) {
    return (
        <div id={"year" + year} className="year">
            <Semester year={parseInt(year)} term="Fall" courses={plancourses} totalCredits={totalCredits} setTotalCredits={setTotalCredits} />
            <Semester year={parseInt(year) + 1} term="Spring" courses={plancourses} totalCredits={totalCredits} setTotalCredits={setTotalCredits} />
            <Semester year={parseInt(year) + 1} term="Summer" courses={plancourses} totalCredits={totalCredits} setTotalCredits={setTotalCredits} />
        </div>
    )
}

export default Year