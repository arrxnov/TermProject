//=============================================================================================//
//=========================================IMPORTS=============================================//
//=============================================================================================//

import React from 'react'
import ReactDOM from 'react-dom/client'
import Ape from './Ape'

//=============================================================================================//
//=================================ASYNC FETCH FUNCTIONS=======================================//
//=============================================================================================//

async function getPlanJSON() {
  let response = await fetch("http://localhost:3000/student/plans/4");
  let json =  await response.json();
  return json;
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
let plan = await getPlanJSON();

// if (validated) {
//     infoJSON = await getUserInfo();
//     plan = await getPlanJSON();
//     planDataJSON = await getPlanDataJSON();
//     plancourses = await getPlanCourses();
//     reqsJSON = await getRequirements();
// }

ReactDOM.createRoot(document.getElementById('root')).render(
    <>
        <Ape plan={plan} />
    </>
)