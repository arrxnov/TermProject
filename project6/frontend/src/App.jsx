import { useState } from 'react'
import './css/style.css'

// const express = require('express');

// const app = express ();
// app.use(express.json());

// const PORT = process.env.PORT || 3000;

// app.listen(PORT, () => {
//   console.log("Server Listening on PORT:", port);
// });

// app.get("/test", (request, response) => {
//   const status = {
//     "Status": "Running"
//  };
 
//  response.send(status);
// });

function App() {
  return (
    <>
      <head>

      <meta charset="utf-8" />
      <title>APE</title>
      <link rel="icon" href="images/favicon/favicon-96x96.png" />
      <link rel="stylesheet" href="css/style.css" />
      <link rel="stylesheet" href="css/datatables.css" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat&display=swap" />
      <script src="https://code.jquery.com/jquery-3.6.0.js"></script>
      <script src="https://code.jquery.com/ui/1.13.2/jquery-ui.js"></script>
      <script src="src/js/datatables.js"></script>
      <script src="src/js/form.js" defer></script>

      </head>

      <body>

      <header>
          <img src="images/ape-no-bg.png" id="icon" alt="image of an ape reading" />
          <h1>APE</h1>
          <div id="headerBtns">
              <ul className="menu">
                  <li><p className="btn-clickable" id="optionsHeader">Options</p>
                      <ul className="subMenu">
                          <li>
                              <p>Plans</p>
                              <ul id="planSubMenu"></ul>
                          </li>
                          <li>
                              <p>Themes</p>
                              <ul id="themeSubMenu"></ul>
                          </li>
                          <li>
                              <p>Print</p>
                          </li>
                          <li>
                              <p>Grades</p>
                          </li>
                          <li>
                              <p>Waivers</p>
                          </li>
                          <li>
                              <p>About</p>
                          </li>
                          <li>
                              <p>Help</p>
                          </li>
                          <li>
                              <p>Report Bug</p>
                          </li>
                      </ul>
                  </li>
              </ul>
              <button className="btn" id="save">Save</button>
              <button className="btn-clickable" id="logout">Log Out</button>
          </div> 
      </header>

      <main>

          <div id="leftContainer">
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
              <div id="LL">
                  <div className="labels">
                      <p>Homepages</p>
                  </div>
                  <div className="basicContainer" id="miscBox">
                      <div id="homePages">
                          <button className="btn-clickable" id="jgradyBtn">Jacob Grady</button>
                          <button className="btn-clickable" id="kdelsingBtn">Kai Delsing</button>
                          <button className="btn-clickable" id="lmillerBtn">Logan Miller</button>
                          <button className="btn-clickable" id="commitBtn">Privacy Policy</button>
                          <button className="btn-clickable" id="minerBtn">View Funds</button>
                          <button className="btn-clickable blink" id="votingBtn">VOTE FOR US HERE!!</button>
                      </div>
                  </div>
              </div>
          </div>

          <div id="rightContainer">
              <div id="UR">
                  <div id="planHeader" className="labels"></div>
                  <div id="planSubheader" className="labels"></div>
                  <div id="plan">
                      <div id="year1" className="year">
                          <div id="semester1" className="semester fall" ondrop="dropHandler(event)" ondragover="dragOverHandler(event)">
                              <div className="semesterHeader">
                                  <div className="term">Fall 2021</div>
                                  <div className="credits">Credits:</div>
                              </div>
                          </div>
                          <div id="semester2" className="semester spring" ondrop="dropHandler(event)" ondragover="dragOverHandler(event)">
                              <div className="semesterHeader">
                                  <div className="term">Spring 2022</div>
                                  <div className="credits">Credits:</div>
                              </div>
                          </div>
                          <div id="semester3" className="semester summer" ondrop="dropHandler(event)" ondragover="dragOverHandler(event)">
                              <div className="semesterHeader">
                                  <div className="term">Summer 2022</div>
                                  <div className="credits">Credits:</div>
                              </div>
                              <p></p>
                          </div>
                      </div>
                      
                      <div id="year2" className="year">
                          <div id="semester4" className="semester fall" ondrop="dropHandler(event)" ondragover="dragOverHandler(event)">
                              <div className="semesterHeader">
                                  <div className="term">Fall 2022</div>
                                  <div className="credits">Credits:</div>
                              </div>
                          </div>
                          <div id="semester5" className="semester spring" ondrop="dropHandler(event)" ondragover="dragOverHandler(event)">
                              <div className="semesterHeader">
                                  <div className="term">Spring 2023</div>
                                  <div className="credits">Credits:</div>
                              </div>
                          </div>
                          <div id="semester6" className="semester summer" ondrop="dropHandler(event)" ondragover="dragOverHandler(event)">
                              <div className="semesterHeader">
                                  <div className="term">Summer 2023</div>
                                  <div className="credits">Credits:</div>
                              </div>
                              <p></p>
                          </div>
                      </div>
                      
                      <div id="year3" className="year">
                          <div id="semester7" className="semester fall" ondrop="dropHandler(event)" ondragover="dragOverHandler(event)">
                              <div className="semesterHeader">
                                  <div className="term">Fall 2023</div>
                                  <div className="credits">Credits:</div>
                              </div>
                          </div>
                          <div id="semester8" className="semester spring" ondrop="dropHandler(event)" ondragover="dragOverHandler(event)">
                              <div className="semesterHeader">
                                  <div className="term">Spring 2024</div>
                                  <div className="credits">Credits:</div>
                              </div>
                          </div>
                          <div id="semester9" className="semester summer" ondrop="dropHandler(event)" ondragover="dragOverHandler(event)">
                              <div className="semesterHeader">
                                  <div className="term">Summer 2024</div>
                                  <div className="credits">Credits:</div>
                              </div>
                              <p></p>
                          </div>
                      </div>
                      
                      <div id="year4" className="year">
                          <div id="semester10" className="semester fall" ondrop="dropHandler(event)" ondragover="dragOverHandler(event)">
                              <div className="semesterHeader">
                                  <div className="term">Fall 2024</div>
                                  <div className="credits">Credits:</div>
                              </div>
                          </div>
                          <div id="semester11" className="semester spring" ondrop="dropHandler(event)" ondragover="dragOverHandler(event)">
                              <div className="semesterHeader">
                                  <div className="term">Spring 2025</div>
                                  <div className="credits">Credits:</div>
                              </div>
                          </div>
                          <div id="semester12" className="semester summer" ondrop="dropHandler(event)" ondragover="dragOverHandler(event)">
                              <div className="semesterHeader">
                                  <div className="term">Summer 2025</div>
                                  <div className="credits">Credits:</div>
                              </div>
                              <p></p>
                          </div>
                      </div>
                  </div>
              </div>

              <div id="LR">
                  <div className="labels">
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
          </div>

      </main>
      </body>
    </>
  )
}

export default App
