import React from 'react'

function onDragStart(ev) {
    ev.preventDefault();
    ev.dataTransfer.effectAllowed = "move";
}

function Course({id, course}) {
    return (
        <>
            <p id={course.term + course.year + id} className="course" draggable={(course.year >= 2024 && (course.term == "SP" && course.year == 2024 ? false : true) ? "true" : "false")} ondragstart={onDragStart}> <span className="course-id">{course.course_id}</span> {course.name}<span className="course-credits">{course.credits}</span></p>
        </>
    )
}

export default Course