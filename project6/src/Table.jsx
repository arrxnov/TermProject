import React from 'react'
import ReactDOM from 'react-dom/client'

function Table() {
    return (
        <>
            <div id="LR">
                <div className="labels-ape">
                    <p>Course Finder</p>
                </div>
                <div className="basicContainer" id="courseFinder">
                    <table id="searchTable">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Title</th>
                                <th>Credits</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}
export default Table