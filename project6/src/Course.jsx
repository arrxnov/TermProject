import React from 'react'

function Course({course}) {
    return (
        <>
            <p className="course" draggable={(course.year >= 2024 && (course.term == "SP" && course.year == 2024 ? false : true) ? "true" : "false")} ondragstart="dragStartHandler"> <span className="course-id">{course.course_id}</span> {course.name}<span className="course-credits">{course.credits}</span></p>
        </>
    )
}

export default Course