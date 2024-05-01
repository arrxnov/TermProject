import React from 'react';


function populatePlans(planJSON) {
  return (
      <>
          {planJSON.map(plan => <Dropdown.Item href={"javascript: changePlan(\"" + plan.id + "\")"} key={"plan" + plan.id}>{plan.name}</Dropdown.Item>)}
      </>
  )
}
function getStudent(studentId) {
  studentJSON = getStudentData(studentId);
  return (
      <>
          <td href={"javascript: GOTOSTUDENTPLAN()"} key={"student" + studentJSON.id}>{student.name} {student.email}</td>
      </>
  )
}

function getRows(students) {
  return (
    <>
        <tr>
          {students.map(student => <Dropdown.Item href={"javascript: changePlan(\"" + plan.id + "\")"} key={"plan" + student.id}>{student.name}</Dropdown.Item>)}
        </tr>
    </>
)
}

function Table() {
  return (
      <>
        <div className="basicContainer" id="courseFinder">
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>
                  {getRows()}
                </tbody>
            </table>
        </div>
      </>
  )
}

async function getAdvisees() {
  let response = await fetch("http://localhost:3000/faculty/advisees");
  let results = response.json();
  console.log(results);
  return results;
}

export default async function Faculty() {
  let advisees = await getAdvisees();
  return(
//    <h2>Faculty</h2>
   
    <div>
      {advisees.map((advisee) => { return <p>advisee.name</p>})}
    </div>
    
  );
}