import React from 'react'
import ReactDOM from 'react-dom/client'
import Year from './Year'

function Plan({plancourses, totalCredits, setTotalCredits}) {
    let years = [];
    for (let course of plancourses) {
        if (course.term === "FA" && !years.includes(course.year)) {
            years.push(course.year);
        } else if ((course.term === "SP" || course.term === "SU") && !years.includes(course.year - 1)) {
            years.push(course.year);
        }
    }

    years.sort();
    
    return (
        <div id="plan">
            {years.map(year => <Year key={"year" + year} year={year} plancourses={plancourses} totalCredits={totalCredits} setTotalCredits={setTotalCredits} />)}
        </div>
    )
}

export default Plan