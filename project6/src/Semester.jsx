import React from 'react'
import Course from './Course.jsx'

function printCourses(term, year, courses, semesterCredits, setSemesterCredits, totalCredits, setTotalCredits) {
    let retcourses = [];
    let credits = 0.0;
    let noncoll = 0;
    for (let course of courses) {
        if ((course.term === "FA" && term !== "Fall")
            || (course.term === "SP" && term !== "Spring")
            || (course.term === "SU" && term !== "Summer")
        ) {
            continue;
        }  
        if (course.year === year) {
            retcourses.push(<Course id={noncoll} course={course} />);
            credits += course.credits;
        }
    }

    // setSemesterCredits(credits);
    return retcourses;
}

function Semester({term, year, courses, totalCredits, setTotalCredits}) {
    const [semesterCredits, setSemesterCredits] = React.useState(0);
    let semcourses = printCourses(term, year, courses, semesterCredits, setSemesterCredits);
    // let total = totalCredits;
    // let sem = semesterCredits;
    // setTotalCredits(total + sem);
    return (
        <>
            <div className="semester fall">
                <div className="semesterHeader">
                    <div className="term">{term} {year}</div>
                    <div className="credits">Credits: {semesterCredits}</div>
                </div>
                {semcourses.map(course => <>{course}</>)}
            </div>
        </>
    )
}

export default Semester