import React from 'react'

function logOutHandler(ev) {
    console.log("You tried to log out!");
}

function Header(studentId) {
    return (
        <>  
            <header>
                <img src="src/images/ape-no-bg.png" id="icon" alt="image of an ape reading" />
                <h1>APE</h1>
                <div id="headerBtns">
                    <ul className="menu">
                        <li><p className="btn-clickable" id="optionsHeader">Options</p>
                            <ul className="subMenu">
                                <li>
                                    <p>Plans</p>
                                    <ul id="planSubMenu"></ul>
                                </li>
                                <li>
                                    <p>Themes</p>
                                    <ul id="themeSubMenu"></ul>
                                </li>
                                <li>
                                    <p>Print</p>
                                </li>
                                <li>
                                    <p>Grades</p>
                                </li>
                                <li>
                                    <p>Waivers</p>
                                </li>
                                <li>
                                    <p>About</p>
                                </li>
                                <li>
                                    <p>Help</p>
                                </li>
                                <li>
                                    <p>Report Bug</p>
                                </li>
                            </ul>
                        </li>
                    </ul>
                    <button className="btn" id="save">Save</button>
                    <button className="btn-clickable" id="logout" onClick={logOutHandler}>Log Out</button>
                </div> 
            </header>
        </>
    )
}

export default Header