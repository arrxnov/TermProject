import {
    useNavigate,
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";
import { useState } from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import Button from 'react-bootstrap/Button'
import Helmet from 'react-helmet'
// import Faculty from './Faculty.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import './css/style.css'
import './css/datatables.css'

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

function Left({reqs}) {
  return (
      <div id="leftContainer">
          <Requirements reqs={reqs}/>
          <Special />
      </div>
  )
}


//=============================================================================================//
//=====================================RIGHT SIDE FUNCTIONS====================================//
//=============================================================================================//

function Course({id, course}) {
  return (
      <>
          <p id={course.term + course.year + id} className="course" draggable={(course.year >= 2024 && (course.term == "SP" && course.year == 2024 ? false : true) ? "true" : "false")} ondragstart={onDragStart}> <span className="course-id">{course.course_id}</span> {course.name}<span className="course-credits">{course.credits}</span></p>
      </>
  )
}

function printCourses(term, year, courses, semesterCredits, setSemesterCredits, totalCredits, setTotalCredits) {
  let retcourses = [];
  let credits = 0.0;
  let noncoll = 0;
  for (let course of courses) {
      if ((course.term === "FA" && term !== "Fall")
          || (course.term === "SP" && term !== "Spring")
          || (course.term === "SU" && term !== "Summer")
      ) {
          continue;
      }  
      if (course.year === year) {
          retcourses.push(<Course id={noncoll} course={course} />);
          credits += course.credits;
          noncoll++;
      }
  }

  // setSemesterCredits(credits);
  return retcourses;
}

function Semester({term, year, courses, totalCredits, setTotalCredits}) {
  const [semesterCredits, setSemesterCredits] = React.useState(0);
  let semcourses = printCourses(term, year, courses, semesterCredits, setSemesterCredits);
  // let total = totalCredits;
  // let sem = semesterCredits;
  // setTotalCredits(total + sem);
  return (
      <>
          <div className="semester fall" onDrop={onDrop} onDragOver={dragOver}>
              <div className="semesterHeader">
                  <div className="term">{term} {year}</div>
                  <div className="credits">Credits: {semesterCredits}</div>
              </div>
              {semcourses.map(course => <>{course}</>)}
          </div>
      </>
  )
}

function Year({year, plancourses, totalCredits, setTotalCredits}) {
  return (
      <div id={"year" + year} className="year">
          <Semester year={parseInt(year)} term="Fall" courses={plancourses} totalCredits={totalCredits} setTotalCredits={setTotalCredits} />
          <Semester year={parseInt(year) + 1} term="Spring" courses={plancourses} totalCredits={totalCredits} setTotalCredits={setTotalCredits} />
          <Semester year={parseInt(year) + 1} term="Summer" courses={plancourses} totalCredits={totalCredits} setTotalCredits={setTotalCredits} />
      </div>
  )
}

function Plan({plancourses, totalCredits, setTotalCredits}) {
  let years = [];
  for (let course of plancourses) {
      if (course.term === "FA" && !years.includes(course.year)) {
          years.push(course.year);
      } else if ((course.term === "SP" || course.term === "SU") && !years.includes(course.year - 1)) {
          years.push(course.year);
      }
  }

  years.sort();
  
  return (
      <div id="plan">
          {years.map(year => <Year key={"year" + year} year={year} plancourses={plancourses} totalCredits={totalCredits} setTotalCredits={setTotalCredits} />)}
      </div>
  )
}

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

function renderChoose(info, planJSON, planDataJSON, reqs, plancourses, totalCredits, setTotalCredits) {
    if (isFaculty()) {
    return (
      <main>
        <Faculty />
      </main>
    )
  } else {
    return (
      <main>
        <Left reqs={reqs} />
        <Right info={info} plans={planJSON} plandata={planDataJSON} plancourses={plancourses} isfaculty={false} />
      </main>
    )
  }
}

//=============================================================================================//
//=======================================HEADER CODE===========================================//
//=============================================================================================//
function logOutHandler(ev) {
  // Log out user
  // TODO check if this actually works
  window.location.href = '/logout'
  console.log("You tried to log out!");
}

function saveHandler() {
  // POST saved data to database
  
  console.log("You tried to save!");
}

function Header(infoJSON, planJSON) {
  return (
      <>  
          <header>
              <img src="src/images/ape-no-bg.png" id="icon" alt="image of an ape reading" />
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
                          <Dropdown.Item id="mint-btn">Mint</Dropdown.Item>
                          <Dropdown.Item id="atlantis-btn">Atlantis</Dropdown.Item>
                          <Dropdown.Item id="avenue-btn">Avenue</Dropdown.Item>
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
                  <Button className="btn-clickable" onClick={saveHandler}>Save</Button>
                  <Button className="btn-clickable" onClick={logOutHandler}>Log Out</Button>
                  </div> 
          </header>
      </>
  )
}

function populatePlans(planJSON) {
  return (
      <>
          {planJSON.map(plan => <Dropdown.Item key={"plan" + plan.id}>{plan.name}</Dropdown.Item>)}
      </>
  )
}

//=============================================================================================//
//=========================================LOGIN STUFF=========================================//
//=============================================================================================//

async function submitHandler(username, password, setValid, ev) {  
    let response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({"username": username, "phash": password});
    });
    let ret = await response.json();
    if (ret.authenticated) setValid(true);
    else setValid(false);
}

function Login(setValid) {
    let [username, setUsername] = useState('');
    let [password, setPassword] = useState('');
    return (
        <>
            <header>
                <img src="src/images/ape-no-bg.png" id="icon" alt="image of an ape reading" />
                <h1>APE</h1>
            </header>
            <main>
                <form id="login-form" onSubmit={(ev) => { submitHandler(username, password, setValid, ev); }}>
                    <input onChange={(ev) => {setUsername(ev.target.value)}} type="text" id="user" name="user" placeholder="Username" />
                    <input onChange={(ev) => {setPassword(ev.target.value)}} type="password" id="pw" name="pw" placeholder="Password" />
                    <button type="submit" default="disable">Submit</button>
                </form>
            </main>
        </>
    )
}

function Ape({validated, infoJSON, plan, planDataJSON, reqsJSON, plancourses}) {
    let [valid, setValid] = useState(validated);
    if (valid) {
        return (
            <>
                <Helmet>
                    <script src="js/datatables.js"></script>
                    <script src="js/form.js" defer></script>
                </Helmet>
                <Header infoJSON={infoJSON} planJSON={plan} />
                {renderChoose(infoJSON, plan, planDataJSON, reqsJSON, plancourses)}
            </>
        )
    } else {
        return (
            <>
                <Helmet>
                    <script src="js/form.js" defer></script>
                </Helmet>
                <Login setValid={setValid} />
            </>
        )
    }
}

export default Ape;