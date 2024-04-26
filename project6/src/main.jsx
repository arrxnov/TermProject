import React from 'react'
import ReactDOM from 'react-dom/client'
import Header from './Header'
import Left from './Left.jsx'
import Right from './Right.jsx'
import './css/style.css'
import './css/datatables.css'

function getUserInfo() {
  
}

function renderStudent() {

}

infoJSON = getUserInfo();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Header info={info}/>
    <Left />
    <Right />
  </React.StrictMode>,
)
