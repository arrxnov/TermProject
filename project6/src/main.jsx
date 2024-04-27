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

// async function getPlanJSON() {
//   let response = await fetch("http://localhost:3000/plans/1/:1");
//   return await response.json();
// }

function isFaculty() {
  return false;
}

function renderChoose() {
  if (isFaculty()) {

  } else {
    return (
      <>
        <Left />
        <Right />
      </>
    )
  }
}

let infoJSON = await getUserInfo();
// let planJSON = await getPlanJSON();
let planJSON = {};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Header info={infoJSON} planJSON={planJSON} />
    {renderChoose()}
  </React.StrictMode>,
)


