function Header(studentId) {
    return (
        <>
            <head>

                <meta charset="utf-8" />
                <title>APE</title>
                <link rel="icon" href="images/favicon/favicon-96x96.png" />
                <link rel="stylesheet" href="css/style.css" />
                <link rel="stylesheet" href="css/datatables.css" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat&display=swap" />
                <script src="https://code.jquery.com/jquery-3.6.0.js"></script>
                <script src="https://code.jquery.com/ui/1.13.2/jquery-ui.js"></script>
                <script src="js/datatables.js"></script>
                <script src="js/form.js" defer></script>

            </head>
            
            <header>
                <img src="images/ape-no-bg.png" id="icon" alt="image of an ape reading" />
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
                    <button className="btn-clickable" id="logout">Log Out</button>
                </div> 
            </header>
        </>
    )
}

export default Header