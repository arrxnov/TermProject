

function Requirements(studentId, planId) {
    return (
        <>
            <div id="UL">
                <div className="labels">
                    <p>Requirements</p>
                </div>
                <div className="basicContainer" id="courseReqs">
                    <h3 className="btn-accordion" id="coreHeader">Core</h3>
                    <div id="core" className="acc-div">
                    </div>
                    <h3 className="btn-accordion" id="electivesHeader">Electives</h3>
                    <div id="electives" className="acc-div">
                    </div>
                    <h3 className="btn-accordion" id="cognatesHeader">Cognates</h3>
                    <div id="cognates" className="acc-div"> 
                    </div>
                    <h3 className="btn-accordion" id="genedsHeader">Gen-Eds</h3>
                    <div id="geneds" className="acc-div">
                    </div>
                </div>
            </div>
        </>
    )
}
export default Requirements