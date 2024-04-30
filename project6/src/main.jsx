//=============================================================================================//
//=========================================IMPORTS=============================================//
//=============================================================================================//

import React from 'react'
import ReactDOM from 'react-dom/client'
import Ape from './Ape'

//=============================================================================================//
//=================================ASYNC FETCH FUNCTIONS=======================================//
//=============================================================================================//

async function getUserInfo() {
    let response = await fetch("http://localhost:3000/student/studentdata/1");
    let json = await response.json();
    return json;
  }
  
  async function getRequirements() {
    let response = await fetch("http://localhost:3000/plan/planreqs/1");
    if (response.status < 400) return await response.json();
  }
  
  async function getPlanCourses() {
    let response = await fetch("http://localhost:3000/plan/plancourses/1");
    if (response.status < 400) return await response.json();
  }
  
  async function getPlanJSON() {
    let response = await fetch("http://localhost:3000/student/plans/1");
    let json =  await response.json();
    return json;
  }
  
  async function getPlanDataJSON() {
    let response = await fetch("http://localhost:3000/plan/plandata/1");
    if (response.status < 400) return await response.json();
  }

  
  
//   async function checkUser() {
//       let response = await fetch("http://localhost:3000/auth/checklogin");
//       let value = await response.json();
//       if (value.valid) {
//           console.log("Yup dat boi logged in");
//           return true;
//       } else {
//           console.log("Who dat mann?")
//           return false;
//       }
//   }
  

//=============================================================================================//
//=============================GLOBAL AND RENDER ROUTINE=======================================//
//=============================================================================================//

let infoJSON = await getUserInfo();
let plan = await getPlanJSON();
let planDataJSON = await getPlanDataJSON();
let plancourses = await getPlanCourses();
let reqsJSON = await getRequirements();

// if (validated) {
//     infoJSON = await getUserInfo();
//     plan = await getPlanJSON();
//     planDataJSON = await getPlanDataJSON();
//     plancourses = await getPlanCourses();
//     reqsJSON = await getRequirements();
// }

ReactDOM.createRoot(document.getElementById('root')).render(
    <>
        <Ape infoJSON={infoJSON} plan={plan} planDataJSON={planDataJSON} plancourses={plancourses} reqsJSON={reqsJSON} />
    </>
)