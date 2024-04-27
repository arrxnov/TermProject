import React from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

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

function populatePlans(planJSON) {
    const retval = planJSON.map(plan => <Dropdown.Item>{plan}</Dropdown.Item>);
    return (
        <>
            {retval}
        </>
    )
}

function mint() {

}

function atlantis() {

}

function avenue() {

}

function Header({infoJSON, planJSON}) {
    console.log(planJSON)
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
                            {populatePlans(planJSON)}
                            <Dropdown.Item>Add Plan</Dropdown.Item>
                            <Dropdown.Item>Delete Plan</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Dropdown>
                        <Dropdown.Toggle className="btn-clickable">
                            Themes
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onSelect={mint}>Mint</Dropdown.Item>
                            <Dropdown.Item onSelect={atlantis}>Atlantis</Dropdown.Item>
                            <Dropdown.Item onSelect={avenue}>Avenue</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Dropdown>
                        <Dropdown.Toggle className="btn-clickable">
                            Options
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item>Print</Dropdown.Item>
                            <Dropdown.Item>Report a Bug</Dropdown.Item>
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