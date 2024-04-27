import React from 'react'
import ReactDOM from 'react-dom/client'
import Header from './Header'
import Left from './Left.jsx'
// import Right from './Right.jsx'
import 'bootstrap/dist/css/bootstrap.css'; 
import './css/style.css'
import './css/datatables.css'


async function getUserInfo() {
  return {};
}

async function getRequirements() {
  let response = await fetch("http://localhost:3000/plan/planreqs/1/1");
  let reqs = response.json();
  return reqs;
}

// async function getPlanJSON() {
//   let response = await fetch("http://localhost:3000/plans/1/:1");
//   return await response.json();
// }

function isFaculty() {
  return false;
}

function renderStudent() {

}

function renderChoose(reqs) {
  if (isFaculty()) {

  } else {
    return (
      <>
        <Left reqs={reqs} />
        {/*<Right /> */}
      </>
    )
  }
}

let infoJSON = await getUserInfo();
// let planJSON = await getPlanJSON();
let planJSON = [
  "My Plan",
  "My Other Plan",
  "The BEST Plan",
  "Too late to quit now"
];
let reqsJSON = await getRequirements();
console.log(planJSON);
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Header info={infoJSON} planJSON={planJSON} />
    {renderChoose(reqsJSON)}
  </React.StrictMode>,
)


