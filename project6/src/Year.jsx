import './css/style.css'
import Semester from './Semester.jsx'

function Year(yearNum) {
    return (
        <>
            <div id={yearNum} className="year">
                <Semester 
                    term="Fall"
                    year={yearNum}
                />
                <Semester 
                    term="Spring"
                    year={yearNum + 1}
                />
                <Semester 
                    term="Summer"
                    year={yearNum + 1}
                />
            </div>
        </>
    )
}