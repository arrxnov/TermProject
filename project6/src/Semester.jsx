import './css/style.css'

function Semester({ term, year }) {
    return (
        <>
            <div id={term + year} className="semester fall" onDrop="dropHandler(event)" onDragOver="dragOverHandler(event)">
                <div className="semesterHeader">
                    <div className="term">Fall 2022</div>
                    <div className="credits">Credits: </div>
                </div>
            </div>
        </>
    )
}
