import React from 'react'
import ReactDOM from 'react-dom/client'
import Header from './Header'
import Left from './Left.jsx'
import Right from './Right.jsx'
import './css/style.css'
import './css/datatables.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Header />
    <Left />
    <Right />
  </React.StrictMode>,
)
