import React from 'react'
import ReactDOM from 'react-dom/client'
import Header from './Header'
import Left from './Left.jsx'
import Right from './Right.jsx'
import Faculty from './Faculty.jsx'
import $ from 'jquery'
import 'bootstrap/dist/css/bootstrap.min.css'
import './css/style.css'
import './css/datatables.css'

async function getUserInfo() {
  let response = await fetch("http://localhost:3000/student/studentdata/1/1");
  return await response.json();
}

async function getRequirements() {
  let response = await fetch("http://localhost:3000/plan/planreqs/1/1");
  return await response.json();
}

async function getPlanCourses() {
  let response = await fetch("http://localhost:3000/plan/plancourses/1/1");
  return await response.json();
}

async function getPlanJSON() {
  let response = await fetch("http://localhost:3000/student/plans/1/1");
  return await response.json();
}

async function getPlanDataJSON() {
  let response = await fetch ("http://localhost:3000/plan/plandata/1/1");
  return await response.json();
}

function isFaculty() {
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

let infoJSON = await getUserInfo();
let planJSON = await getPlanJSON();
let planDataJSON = await getPlanDataJSON();
let plancourses = await getPlanCourses();
let reqsJSON = await getRequirements();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Header info={infoJSON} planJSON={planJSON} />
    {renderChoose(infoJSON, planJSON, planDataJSON, reqsJSON, plancourses)}
  </React.StrictMode>,
)
