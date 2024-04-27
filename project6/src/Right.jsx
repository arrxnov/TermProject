import Plan from './Plan'
import Table from './Table'
import React from 'react'
import ReactDOM from 'react-dom/client'

function printMajors(plandata) {
    let majorstring = "";
    let majors = plandata.majors;
    for (let major of majors) {
        majorstring += major;
        if (major !== majors[majors.length - 1]) {
            majorstring += ", "
        }
    }
    return majorstring;
}

function printMinors(plandata) {
    let minorstring = "";
    let minors = plandata.minors;
    for (let minor of minors) {
        minorstring += minor;
        if (minor !== minors[minors.length - 1]) {
            minorstring += ", "
        }
    }
    return minorstring;
}

function Right({info, plans, plandata, plancourses, allcourses}) {
    const [totalCredits, setTotalCredits] = React.useState(0);
    console.log(plandata.majors);
    let default_plan = {};
    for (let plan of plans) {
        if (plan.id === info.default_plan_id) {
            default_plan = plan;
            break;
        }
    }
    
    return (
        <div id="rightContainer">
            <div id="UR">
                <div id="planHeader" className="labels-ape">
                    <p><strong>Student:</strong> {info.name}</p>
                    <p><strong>Plan:</strong> {default_plan.name}</p>
                    <p><strong>Total Hours:</strong> {totalCredits}</p>
                </div>
                <div id="planSubheader" className="labels-ape">
                    <p><strong>Major:</strong> {printMajors(plandata)}</p>
                    <p><strong>Minor:</strong> {printMinors(plandata)}</p>
                    <p><strong>Catalog:</strong> {plandata.catalog_year}</p>
                    <p><strong>GPA:</strong> {info.gpa}</p>
                    <p><strong>Major GPA:</strong> {info.major_gpa}</p>
                </div>
                <Plan plancourses={plancourses} totalCredits={totalCredits} setTotalCredits={setTotalCredits} />
            </div>
            <Table allcourses={allcourses} />
        </div>
    )
}
export default Right