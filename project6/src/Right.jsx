import Plan from './Plan'
import Table from './Table'
import React from 'react'
import ReactDOM from 'react-dom/client'

function Right(studentinfo, plancourses, allcourses) {
    return (
        <div id="rightContainer">
            <div id="UR">
                <div id="planHeader" className="labels-ape"></div>
                <div id="planSubheader" className="labels-ape"></div>
                <Plan studentinfo={studentinfo} plancourses={plancourses} />
            </div>
            <Table allcourses={allcourses} />
        </div>
    )
}
export default Right