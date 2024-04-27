import React from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import Button from 'react-bootstrap/Button'

function logOutHandler(ev) {
    // Log out user
    
    console.log("You tried to log out!");
}

function saveHandler() {
    // POST saved data to database
    
    console.log("You tried to save!");
}

function populatePlans(planJSON) {
    const retval = planJSON.map(plan => <Dropdown.Item key={"plan" + plan.id}>{plan.name}</Dropdown.Item>);
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
    return (
        <>  
            <header>
                <img src="src/images/ape-no-bg.png" id="icon" alt="image of an ape reading" />
                <h1>APE</h1>
                <div id="headerBtns">
                    <Dropdown key="1">
                        <Dropdown.Toggle className="btn-clickable" id="dropdown-basic">
                            Plans
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {populatePlans(planJSON)}
                            <Dropdown.Item>Add Plan</Dropdown.Item>
                            <Dropdown.Item>Delete Plan</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Dropdown key="2">
                        <Dropdown.Toggle className="btn-clickable">
                            Themes
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item id="mint-btn">Mint</Dropdown.Item>
                            <Dropdown.Item id="atlantis-btn">Atlantis</Dropdown.Item>
                            <Dropdown.Item id="avenue-btn">Avenue</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Dropdown key="3">
                        <Dropdown.Toggle className="btn-clickable">
                            Options
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item>Print</Dropdown.Item>
                            <Dropdown.Item>Report a Bug</Dropdown.Item>
                            <Dropdown.Item>Sign a Waiver</Dropdown.Item>
                            <Dropdown.Item>Speak With a Manager</Dropdown.Item>
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