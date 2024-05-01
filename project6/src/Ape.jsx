import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Dropdown from 'react-bootstrap/Dropdown'
import Helmet from 'react-helmet'
import 'bootstrap/dist/css/bootstrap.min.css'
import './css/style.css'
import './css/datatables.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';

let global_noncollision = 10000;

//=============================================================================================//
//=======================================FACULTY===============================================//
//=============================================================================================//

function Faculty({}) {
    return (
        <>
            <p>I am faculty!</p>
        </>
    )
}

//=============================================================================================//
//=======================================LEFT SIDE FUNCTIONS===================================//
//=============================================================================================//

function Special() {
  return (
      <div id="LL">
          <div className="labels-ape">
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
      </div>
  )
}

function Requirements() {
  return (
      <div id="UL">
          <div className="labels-ape">
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
  )
}

function Left() {
  return (
      <div id="leftContainer">
          <Requirements />
          <Special />
      </div>
  )
}


//=============================================================================================//
//=====================================RIGHT SIDE FUNCTIONS====================================//
//=============================================================================================//

function Table() {
  return (
      <>
          <div id="LR">
              <div className="labels-ape">
                  <p>Course Finder</p>
              </div>
              <div className="basicContainer" id="courseFinder">
                  <table id="searchTable">
                      <thead>
                          <tr>
                              <th>ID</th>
                              <th>Title</th>
                              <th>Credits</th>
                              <th>Description</th>
                          </tr>
                      </thead>
                      <tbody>
                      </tbody>
                  </table>
              </div>
          </div>
      </>
  )
}

function facNotes () {
    if (isFaculty()) {
        return (
            <>
                <label id="fac_notes_label" className="labels-ape" htmlFor="faculty-notes">Faculty Notes</label>
                <div id="fac_notes">
                    <textarea id="faculty-notes" resizable="false" contentEditable="true" suppressContentEditableWarning={true} />
                </div>
            </>
        )
    } else {
        return <></>
    }
}

function Right() {
  return (
      <div id="rightContainer">
          <div id="UR">
              <div id="planHeader" className="labels-ape">
                  <p><strong>Student:</strong></p>
                  <p><strong>Plan:</strong></p>
                  <p><strong>Total Hours:</strong></p>
              </div>
              <div id="planSubheader" className="labels-ape">
                  <p><strong>Major:</strong></p>
                  <p><strong>Minor:</strong></p>
                  <p><strong>Catalog:</strong></p>
                  <p><strong>GPA:</strong></p>
                  <p><strong>Major GPA:</strong></p>
              </div>
              <div id="plan"></div>
              <div id="MR">
                <label id="stu_notes_label" className="labels-ape" htmlFor="student-notes">Student Notes</label>
                <div id="stu_notes">
                  <textarea id="student-notes" contentEditable="true" resizable="false" suppressContentEditableWarning={true} />
                </div>
                {facNotes()}
                <div id="year-btns">
                  <button id="addyear-btn" className="btn-clickable">Add Year</button>
                  <button id="deleteyear-btn" className="btn-clickable">Delete Year</button>
                </div>
              </div>
          </div>
          <Table  />
      </div>
  )
}

//=============================================================================================//
//=================================MAIN RENDER CODE HELPERS====================================//
//=============================================================================================//
function isFaculty() {
    // FIXME: access current session ID
    // let sessionId = false;
    // let res = auth.validateFaculty(sessionId);
    // return res["valid"];
    return false;
}

function renderChoose(info, planJSON, planDataJSON) {
    if (isFaculty()) {
    return (
      <main>
        <Faculty />
      </main>
    )
  } else {
    return (
      <main>
        <Left />
        <Right info={info} plans={planJSON} plandata={planDataJSON} />
      </main>
    )
  }
}

//=============================================================================================//
//=======================================HEADER CODE===========================================//
//=============================================================================================//
function Header({planJSON}) {
  return (
      <>  
          <header>
              <img src="ape-no-bg.png" id="icon" alt="image of an ape reading" />
              <h1>APE</h1>
              <div id="headerBtns">
                  <Dropdown key="1">
                      <Dropdown.Toggle className="btn-clickable" id="dropdown-basic">
                          Plans
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                          {populatePlans(planJSON)}
                          <Dropdown.Item>Add Plan</Dropdown.Item>
                          <Dropdown.Item>Delete Plan</Dropdown.Item>
                      </Dropdown.Menu>
                  </Dropdown>
                  <Dropdown key="2">
                      <Dropdown.Toggle className="btn-clickable">
                          Themes
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                          <Dropdown.Item id="mint-btn" href="javascript:setMint()">Mint</Dropdown.Item>
                          <Dropdown.Item id="atlantis-btn" href="javascript:setAtlantis()">Atlantis</Dropdown.Item>
                          <Dropdown.Item id="avenue-btn" href="javascript:setAvenue()">Avenue</Dropdown.Item>
                      </Dropdown.Menu>
                  </Dropdown>
                  <Dropdown key="3">
                      <Dropdown.Toggle className="btn-clickable">
                          Options
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                          <Dropdown.Item>Print</Dropdown.Item>
                          <Dropdown.Item>Report a Bug</Dropdown.Item>
                          <Dropdown.Item>Sign a Waiver</Dropdown.Item>
                          <Dropdown.Item>Speak With a Manager</Dropdown.Item>
                      </Dropdown.Menu>
                  </Dropdown>
                  <button id="save-btn" className="btn-clickable">Save</button>
                  <button id="logout-btn" className="btn-clickable">Log Out</button>
                  </div> 
          </header>
      </>
  )
}

function populatePlans(planJSON) {
  return (
      <>
          {planJSON.map(plan => <Dropdown.Item href={"javascript: changePlan(\"" + plan.id + "\")"} key={"plan" + plan.id}>{plan.name}</Dropdown.Item>)}
      </>
  )
}  

function Ape({plan}) {
    return (
        <>
            <Helmet>
                <script src="js/datatables.js"></script>
                <script src="js/form.js" defer></script>
            </Helmet>
            <Header planJSON={plan} />
            <main>
                <Left />
                {console.log("passed left")}
                <Right />
            </main>
        </>
    )
}

export default Ape;