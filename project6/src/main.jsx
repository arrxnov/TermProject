//=============================================================================================//
//=========================================IMPORTS=============================================//
//=============================================================================================//

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

//=============================================================================================//
//=================================ASYNC FETCH FUNCTIONS=======================================//
//=============================================================================================//

// async function getPlanJSON() {
//   let response = await fetch("http://localhost:3000/student/plans/4");
//   let json =  await response.json();
//   return json;
// }

//=============================================================================================//
//=============================GLOBAL AND RENDER ROUTINE=======================================//
//=============================================================================================//
// let plan = await getPlanJSON();

// if (validated) {
//     infoJSON = await getUserInfo();
//     plan = await getPlanJSON();
//     planDataJSON = await getPlanDataJSON();
//     plancourses = await getPlanCourses();
//     reqsJSON = await getRequirements();
// }

ReactDOM.createRoot(document.getElementById('root')).render(
    <>
        <App />
    </>
)