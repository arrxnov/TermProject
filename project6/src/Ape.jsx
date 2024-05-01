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

// //=============================================================================================//
// //=========================================LOGIN STUFF=========================================//
// //=============================================================================================//

// async function submitHandler(username, password, setValid, ev) {  
//     ev.preventDefault();
//     let response = await fetch('http://localhost:3000/auth/login', {
//         method: 'POST',
//         headers: {
//           'Accept': 'application/json',
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({"username": username, "passwd": password})
//     });
//     let ret = await response.json();
//     if (ret.authenticated == true) {
//         console.log("Iss ma boi!");
//         setValid(true);
//     }
//     else {
//         console.log("Who is dat boi?");
//         setValid(false);
//     }
// }

// async function Login(setValid) {
//     let [username, setUsername] = useState('');
//     let [password, setPassword] = useState('');
//     async function submitHandler(ev) {  
//         ev.preventDefault();
//         let response = await fetch('http://localhost:3000/auth/login', {
//             method: 'POST',
//             headers: {
//               'Accept': 'application/json',
//               'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({"username": username, "passwd": password})
//         });
//         let ret = await response.json();
//         if (ret.authenticated == true) {
//             console.log("Iss ma boi!");
//             setValid(true);
//         }
//         else {
//             console.log("Who is dat boi?");
//             setValid(false);
//         }
//     }
//     return (
//         <>
//             <header>
//                 <img src="src/images/ape-no-bg.png" id="icon" alt="image of an ape reading" />
//                 <h1>APE</h1>
//             </header>
//             <main>
//                 <form id="login-form" onSubmit={submitHandler}>
//                     <input onChange={(ev) => {setUsername(ev.target.value)}} type="text" id="user" name="user" placeholder="Username" />
//                     <input onChange={(ev) => {setPassword(ev.target.value)}} type="password" id="pw" name="pw" placeholder="Password" />
//                     <button type="submit">Submit</button>
//                 </form>
//             </main>
//         </>
//     )
// }  

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
                <Right />
            </main>
        </>
    )
}

async function loginUser(credentials) {
  console.log(JSON.stringify(credentials)); // FIXME

  return fetch('http://localhost:3000/auth/login', {
   method: 'POST',
   headers: {
     'Content-Type': 'application/json'
   },
   body: JSON.stringify(credentials)
 })
   .then(data => data.json())
}

export function Login({ setToken }) {
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = async e => {
    e.preventDefault();
    const token = await loginUser({
      username,
      password
    });
    console.log(token); // FIXME
    setToken(token);
  }

  return(
    <div className="login-wrapper">
      <h1>Please Log In</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <p>Username</p>
          <input type="text" onChange={e => setUserName(e.target.value)} />
        </label>
        <label>
          <p>Password</p>
          <input type="password" onChange={e => setPassword(e.target.value)} />
        </label>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  )
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired
};




// async function loginUser(username, password) {
//     let response = await fetch('http://localhost:3000/auth/login', {
//         method: 'POST',
//         headers: {
//           'Accept': 'application/json',
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({"username": username, "passwd": password})
//     });
//     let results = await response.json();
//     if (results.authenticated) {
//         if (results.role == "Faculty") {
//             isAuthFaculty = true;
//             return "faculty";
//         } else if (results.role == "Student") {
//             isAuthStudent = true;
//             return "student";
//         }
//     } else {
//         return "";
//     }
// }

// let isAuthStudent = false;
// let isAuthFaculty = false;

// async function checkUser() {
//     let response = await fetch("http://localhost:3000/auth/checklogin");
//     let value = await response.json();
//     if (value.authenticated) {
//         console.log("Yup dat boi logged in");
//     } else {
//         console.log("Who dat mann?")
//     }
//     return value;
// }

// const LoginForm = () => {
//     const [username, setUsername] = React.useState("");
//     const [password, setPassword] = React.useState("");
//     return (
//         <React.Fragment>
//             <h1>Login Page</h1>
//             <form id="loginForm">
//                 <input onChange={(ev) => { setUsername(ev.target.value); }} id="user-field" type="text" name="user" placeholder="Username" />
//                 <input onChange={(ev) => { setPassword(ev.target.value); }}id="pass-field" type="password" name="password" placeholder="Password" />
//                 <button id="submit-btn" className="btn-clickable" type="submit" onSubmit={() => { navigate("/" + loginUser(username, password)); }}>Login</button>
//             </form>
//         </React.Fragment> 
//     )
// }


// function Login() {
//     return (
//         <>
//             <Router>
//                 <Helmet>
//                     <script src="js/form.js" defer></script>
//                 </Helmet>
//                 <Routes>
//                     <Route path="/" exact component={LoginForm} />
//                     {
//                     isAuthStudent ? 
//                     <>
//                     <Route path="/student/" component={Student} />
//                     </> : <Navigate to="/" />
//                     }

//                     {
//                     isAuthFaculty ? 
//                     <>
//                     <Route path="/student/" component={Ape} />
//                     <Route path="/faculty/" component={Faculty} />
//                     </> : <Navigate to="/" />
//                     }
//                 </Routes>
//                 {() => {
//                     const navigate = useNavigate();
//                     let role = checkUser().role;
//                     navigate("/" + role);
//                 }}
//             </Router>
//         </>
//     );
// }

// export default Login;