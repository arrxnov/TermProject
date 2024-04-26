import React from 'react'
import Drag from './Drag'

function popCore(reqs) {
    let ret = <></>;
    reqs = reqs.reqs.reqs;
    for (let course of reqs) {
        if (course.type === "core") {
            ret += <p className="course req" draggable="true" onDragStart={Drag.onDragStart(this)}><span className="course-id">course.course_id</span>course.name</p>;
        }
    }
}

function popElectives(reqs) {

}

function popCognates(reqs) {

}

function popGeneds(reqs) {

}

function Requirements(reqs) {
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