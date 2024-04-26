import React from 'react'
import ReactDOM from 'react-dom/client'
import Header from './Header'
import Left from './Left.jsx'
import Right from './Right.jsx'
import './css/style.css'
import './css/datatables.css'

async function getUserInfo() {
  return {};
}

async function getRequirements() {
  let response = await fetch("http://localhost:3000/plan/planreqs/1/1");
  await console.log(response);
  let reqs = await response.json();
  return reqs;
}

function renderStudent() {

}

let infoJSON = await getUserInfo();
let reqs = await getRequirements();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Header info={infoJSON}/>
    <Left reqs={reqs}/>
    {/*<Right /> */}
  </React.StrictMode>,
)


