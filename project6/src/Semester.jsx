import React from 'react'
import ReactDOM from 'react-dom/client'
import Course from './Course'

function printCourses(courses) {
    
}

function Semester(courses) {
    return (
        <>
            <div id="semester1" class="semester fall" ondrop="dropHandler(event)" ondragover="dragOverHandler(event)">
                <div class="semesterHeader">
                    <div class="term">Fall 2021</div>
                    <div class="credits">Credits:</div>
                </div>
                {printCourses(courses)}
            </div>
            <Course />
        </>
    )
}

export default Semester