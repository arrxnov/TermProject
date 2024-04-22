import './css/style.css'

function Semester({ term, year }) {
    function dropHandler(ev, el) {
        ev.preventDefault();
        const data = ev.dataTransfer.getData("Text");
        ev.dataTransfer.dropEffect = "copyMove";
        if (document.getElementById(data).classList.contains("table-member")) {
            let classDescriptor = document.getElementById(data).getElementsByTagName("td")[0].innerHTML;
            let className = document.getElementById(data).getElementsByTagName("td")[1].innerHTML;
            let classCredits = document.getElementById(data).getElementsByTagName("td")[2].innerHTML;
            el.innerHTML += "<p class=\"course\" id=" + global_noncollision++ + " draggable=true ondragstart=dragStartHandler(event)><span class=\"course-id\">" + classDescriptor + "</span>\n" + className + "<span class=\"course-credits\">" + classCredits + "</span>\n<\p>";
        } else if (document.getElementById(data).classList.contains("req")) {
            let classDescriptor = document.getElementById(data).getElementsByTagName("span")[0].innerHTML;
            let className = document.getElementById(data).childNodes[1].nodeValue;
            let classCredits = 3.0; // TODO: FIXME
            el.innerHTML += "<p class=\"course\" id=" + global_noncollision++ + " draggable=true ondragstart=dragStartHandler(event)><span class=\"course-id\">" + classDescriptor + "</span>\n" + className + "<span class=\"course-credits\">" + classCredits + "</span>\n<\p>";
        } else {
            el.appendChild(document.getElementById(data));
        }
        checkRequirements();
    }
    
    return (
        <>
            <div id={term + year} className="semester fall" onDrop={dropHandler} onDragOver="dragOverHandler(event)">
                <div className="semesterHeader">
                    <div className="term">Fall 2022</div>
                    <div className="credits">Credits: </div>
                </div>
            </div>
        </>
    )
}
