import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

async function getPlans() {
  let response = await fetch("http://localhost:3000/student/plans");
  return await response.json();
}

let plan = await getPlans();

ReactDOM.createRoot(document.getElementById('root')).render(
    <>
        <App plan={plan} />
    </>
)