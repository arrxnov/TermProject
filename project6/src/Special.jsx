import React from 'react'
import ReactDOM from 'react-dom/client'

function Special() {
    return (
        <>
            <div className="labels">
                <p>Homepages</p>
            </div>
            <div className="basicContainer" id="miscBox">
                <div id="homePages">
                    <button className="btn-clickable" id="jgradyBtn" >Jacob Grady</button>
                    <button className="btn-clickable" id="kdelsingBtn">Kai Delsing</button>
                    <button className="btn-clickable" id="lmillerBtn">Logan Miller</button>
                    <button className="btn-clickable" id="commitBtn">Privacy Policy</button>
                    <button className="btn-clickable blink" id="votingBtn">VOTE FOR US HERE!!</button>
                </div>
            </div>
        </>
    )
}
export default Special