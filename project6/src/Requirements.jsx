import React from 'react'

function onDragStart(ev) {
    ev.preventDefault();
    ev.dataTransfer.effectAllowed = "move";
}

async function getRequirements() {
    let response = await fetch("http://localhost:3000/plan/planreqs/1/1");
    await console.log(response);
    let reqs = await response.json();
    return reqs;
}

function popCore(reqs) {
    reqs = reqs.reqs.reqs;
    let core_courses = [];
    for (let course of reqs) {
        if (course.type === "core") {
            core_courses.append(<p className="course req" draggable="true" onDragStart={onDragStart}><span className="course-id">course.course_id</span>course.name</p>);
        }
    }
    return (
        <>
            {core_courses.map(course => <>{course}</>)}
        </>
    )
}

function popElectives(reqs) {
    reqs = reqs.reqs.reqs;
    let elec_courses = [];
    for (let course of reqs) {
        if (course.type === "core") {
            elec_courses.append(<p className="course req" draggable="true" onDragStart={onDragStart}><span className="course-id">course.course_id</span>course.name</p>);
        }
    }
    return (
        <>
            {core_courses.map(course => <>{course}</>)}
        </>
    )
}

function popCognates(reqs) {
    reqs = reqs.reqs.reqs;
    let elec_courses = [];
    for (let course of reqs) {
        if (course.type === "core") {
            elec_courses.append(<p className="course req" draggable="true" onDragStart={onDragStart}><span className="course-id">course.course_id</span>course.name</p>);
        }
    }
    return (
        <>
            {elec_courses.map(course => <>{course}</>)}
        </>
    )
}

function popGeneds(reqs) {
    reqs = reqs.reqs.reqs;
    let gened_courses = [];
    for (let course of reqs) {
        if (course.type === "core") {
            gened_courses.append(<p className="course req" draggable="true" onDragStart={onDragStart}><span className="course-id">course.course_id</span>course.name</p>);
        }
    }
    return (
        <>
            {gened_courses.map(course => <>{course}</>)}
        </>
    )
}

async function Requirements() {
    let reqs = await getRequirements();
    return (
        <>
            <div id="UL">
                <div className="labels">
                    <p>Requirements</p>
                </div>
                <div className="basicContainer" id="courseReqs">
                    <h3 className="btn-accordion" id="coreHeader">Core</h3>
                    <div id="core" className="acc-div">
                        {popCore(reqs)}
                    </div>
                    <h3 className="btn-accordion" id="electivesHeader">Electives</h3>
                    <div id="electives" className="acc-div">
                        {popElectives(reqs)}
                    </div>
                    <h3 className="btn-accordion" id="cognatesHeader">Cognates</h3>
                    <div id="cognates" className="acc-div">
                        {popCognates(reqs)} 
                    </div>
                    <h3 className="btn-accordion" id="genedsHeader">Gen-Eds</h3>
                    <div id="geneds" className="acc-div">
                        {popGeneds(reqs)}
                    </div>
                </div>
            </div>
        </>
    )
}
export default Requirements