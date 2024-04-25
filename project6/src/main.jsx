import React from 'react'
import ReactDOM from 'react-dom/client'
import Header from './Header'
import Left from './Left.jsx'
import Right from './Right.jsx'
import './css/style.css'
import './css/datatables.css'

function getStudentInfo() {
  
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Header studentId={1} planId/>
    <Left />
    <Right />
  </React.StrictMode>,
)
