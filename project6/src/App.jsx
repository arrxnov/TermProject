// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vitejs.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App

import React, { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import './App.css';
import Student from './Student';
import Faculty from './Faculty';
import Login from './Login';

function App() {
  const [token, setToken] = useState();
  const [role, setRole] = useState();

  if(!token) {
    return <Login setToken={setToken} setRole={setRole} />
  }

  if (role == "Faculty") {
    return (
      <Faculty />
    );
  }

  else if (role == "Student") {
    return (
      <Student />
    );
  }

  // return (
  //   <div className="wrapper">
  //     <h1>Application</h1>
  //     <BrowserRouter>
  //       <Routes>
  //         <Route path="/student" element={<Student />}>
  //         </Route>
  //         <Route path="/faculty" element={<Faculty />}>
  //         </Route>
  //       </Routes>
  //     </BrowserRouter>
  //   </div>
  // );
}

export default App;
