import React from 'react'

function onDragStart(ev) {
    ev.preventDefault();
    ev.dataTransfer.effectAllowed = "move";
}

function dropTrash(ev) {
    ev.preventDefault();
    const data = ev.dataTransfer.getData("Text");
    document.getElementById(data).remove();
    checkRequirements();
}

function dragOver(ev) {
    ev.preventDefault();
}

function popCore(reqs) {
    let core_courses = [];
    for (let course of reqs) {
        if (course.type === "core") {
            core_courses.push(<p className="course req" draggable="true" dragstarthandler={onDragStart}><span className="course-id">{course.course_id}</span> {course.name}</p>);
        }
    }
    return (
        <>
            {core_courses.map(course => <>{course}</>)}
        </>
    )
}

function popElectives(reqs) {
    let elec_courses = [];
    for (let course of reqs) {
        if (course.type === "elective") {
            elec_courses.push(<p className="course req" draggable="true" dragstarthandler={onDragStart}><span className="course-id">{course.course_id}</span> {course.name}</p>);
        }
    }
    return (
        <>
            {elec_courses.map(course => <>{course}</>)}
        </>
    )
}

function popCognates(reqs) {
    let elec_courses = [];
    for (let course of reqs) {
        if (course.type === "cognate") {
            elec_courses.push(<p className="course req" draggable="true" dragstarthandler={onDragStart}><span className="course-id">{course.course_id}</span> {course.name}</p>);
        }
    }
    return (
        <>
            {elec_courses.map(course => <>{course}</>)}
        </>
    )
}

function popGeneds(reqs) {
    let gened_courses = [];
    for (let course of reqs) {
        if (course.type === "gened") {
            gened_courses.push(<p className="course req" draggable="true" dragstarthandler={onDragStart}><span className="course-id">{course.course_id}</span> {course.name}</p>);
        }
    }
    return (
        <>
            {gened_courses.map(course => <>{course}</>)}
        </>
    )
}

function Requirements({reqs}) {
    return (
        <div id="UL">
            <div className="labels-ape">
                <p>Requirements</p>
            </div>
            <div className="basicContainer" id="courseReqs">
                <h3 className="btn-accordion" id="coreHeader">Core</h3>
                <div id="core" className="acc-div" onDragOver={dragOver} onDrop={dropTrash}>
                    {popCore(reqs)}
                </div>
                <h3 className="btn-accordion" id="electivesHeader">Electives</h3>
                <div id="electives" className="acc-div" onDragOver={dragOver} onDrop={dropTrash}>
                    {popElectives(reqs)}
                </div>
                <h3 className="btn-accordion" id="cognatesHeader">Cognates</h3>
                <div id="cognates" className="acc-div" onDragOver={dragOver} onDrop={dropTrash}>
                    {popCognates(reqs)} 
                </div>
                <h3 className="btn-accordion" id="genedsHeader">Gen-Eds</h3>
                <div id="geneds" className="acc-div" onDragOver={dragOver} onDrop={dropTrash}>
                    {popGeneds(reqs)}
                </div>
            </div>
        </div>
    )
}
export default Requirements