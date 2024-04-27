import React from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import 'bootstrap/dist/css/bootstrap.css'; 

function logOutHandler(ev) {
    console.log("You tried to log out!");
}

function saveHandler() {
    // POST saved data to database
    
    console.log("You tried to save!");
}

function optionsDropDown() {
    console.log("Opening options!");
}

async function populatePlans(planJSON) {
    const retval = planJSON.map(plan => <Dropdown.Item>{plan.param}</Dropdown.Item>);
    return (
        <>
            {retval}
        </>
    )
}

async function Header(infoJSON, planJSON) {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    return (
        <>  
            <header>
                <img src="src/images/ape-no-bg.png" id="icon" alt="image of an ape reading" />
                <h1>APE</h1>
                <div id="headerBtns">
                <Dropdown>
                    <Dropdown.Toggle className="btn-clickable" id="dropdown-basic">
                        Plans
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        {await populatePlans(planJSON)}
                    </Dropdown.Menu>
                </Dropdown>
                <Dropdown>
                    <Dropdown.Toggle>
                        Themes
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onSelect={mint}>Mint</Dropdown.Item>
                        <Dropdown.Item onSelect={atlantis}>Atlantis</Dropdown.Item>
                        <Dropdown.Item>Avenue</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                <Dropdown>
                    <Dropdown.Toggle>
                        Options
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item>Mint</Dropdown.Item>
                        <Dropdown.Item>Atlantis</Dropdown.Item>
                        <Dropdown.Item>Avenue</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                <Button className="btn-clickable" onClick={saveHandler}>Save</Button>{' '}
                <Button className="btn-clickable" onClick={logOutHandler}>Log Out</Button>{' '}
                </div> 
            </header>
        </>
    )
}

export default Header