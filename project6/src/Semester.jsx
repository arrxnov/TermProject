import React from 'react'
import ReactDOM from 'react-dom/client'
import Course from './Course'

function printCourses(courses) {
    
}

function Semester({term, year, courses}) {
    return (
        <>
            <div className="semester fall">
                <div className="semesterHeader">
                    <div className="term">{term} {year}</div>
                    <div className="credits">Credits: </div>
                </div>
                {printCourses(courses)}
            </div>
            <Course />
        </>
    )
}

export default Semester