/*
 * Filename: student.js
 * Authors: Logan Miller, Jacob Grady, Kai Delsing
 */

let global_noncollision = "1";
let uid_length = 36;
let plan_id = "";
jQuery(document).ready(function () {
    setupHandlers();
    initPage();
});

async function initPage() {
    jQuery("#courseReqs").accordion({ collapsible: true, });

    document.getElementById("cognates").setAttribute("ondragover", "dragOverHandler(event)");
    document.getElementById("core").setAttribute("ondragover", "dragOverHandler(event)");
    document.getElementById("electives").setAttribute("ondragover", "dragOverHandler(event)");
    document.getElementById("geneds").setAttribute("ondragover", "dragOverHandler(event)");
    document.getElementById("cognates").setAttribute("ondrop", "dropTrash(event, this)");
    document.getElementById("core").setAttribute("ondrop", "dropTrash(event, this)");
    document.getElementById("electives").setAttribute("ondrop", "dropTrash(event, this)");
    document.getElementById("geneds").setAttribute("ondrop", "dropTrash(event, this)");
    
    let data = await getAllCourses();

    populateSearchTable(data);

    // for (let course in document.getElementsByClassName("course")) {
    //    course.onmouseup = function (event) {
    //        if (event.which == 3) {
    //            remove(event.target);
    //            checkRequirements();
    //        }
    //    }
    // }

    rows = document.getElementById("searchTable").getElementsByTagName("tbody")[0].getElementsByTagName("tr");
    for (row of rows) {
        row.setAttribute("id", global_noncollision++);
        row.setAttribute("draggable", true);
        row.setAttribute("ondragstart", "dragStartHandler(event)");
        row.classList.add("table-member");
    }

    let minYear = 0;
    let maxYear = 0;

    let plannedcourses = await getPlanCourses();

    for (let course of plannedcourses) {
        if (minYear == 0 || course["year"] < minYear) minYear = course["year"];
        if (maxYear == 0 || course["year"] > maxYear) maxYear = course["year"];
    }

    for (let i = minYear; i < maxYear; i += 1) {
        document.getElementById("plan").innerHTML += "<div id=\"year" + i + "\" class=\"year\"></div>";
    }
    let currentYear = minYear;

    for (let year of document.getElementsByClassName("year")) {
        if (currentYear < 2023) {
            year.innerHTML += "<div id=\"" + global_noncollision++ + "\" class=\"semester-past\"><div class=\"semesterHeader\"><div class=\"term\">Fall " + (currentYear) + "</div><span class=\"semesterCredits\">Credits: </span></div>";
            year.innerHTML += "<div id=\"" + global_noncollision++ + "\" class=\"semester-past\"><div class=\"semesterHeader\"><div class=\"term\">Spring " + (currentYear + 1) + "</div><span class=\"semesterCredits\">Credits: </span></div>";
            year.innerHTML += "<div id=\"" + global_noncollision++ + "\" class=\"semester-past\"><div class=\"semesterHeader\"><div class=\"term\">Summer " + (currentYear + 1) + "</div><span class=\"semesterCredits\">Credits: </span></div>";
        } else if (currentYear == 2023) {
            year.innerHTML += "<div id=\"" + global_noncollision++ + "\" class=\"semester-past\" ondrop=\"dropHandler(event, this)\" ondragover=\"dragOverHandler(event,this)\"><div class=\"semesterHeader\"><div class=\"term\">Fall " + (currentYear) + "</div><span class=\"semesterCredits\">Credits: </span></div>";
            year.innerHTML += "<div id=\"" + global_noncollision++ + "\" class=\"semester semester-current\" ondrop=\"dropHandler(event, this)\" ondragover=\"dragOverHandler(event,this)\"><div class=\"semesterHeader\"><div class=\"term\">Spring " + (currentYear + 1) + "</div><span class=\"semesterCredits\">Credits: </span></div>";
            year.innerHTML += "<div id=\"" + global_noncollision++ + "\" class=\"semester\" ondrop=\"dropHandler(event, this)\" ondragover=\"dragOverHandler(event,this)\"><div class=\"semesterHeader\"><div class=\"term\">Summer " + (currentYear + 1) + "</div><span class=\"semesterCredits\">Credits: </span></div>";
        } else {
            year.innerHTML += "<div id=\"" + global_noncollision++ + "\" class=\"semester\" ondrop=\"dropHandler(event, this)\" ondragover=\"dragOverHandler(event,this)\"><div class=\"semesterHeader\"><div class=\"term\">Fall " + (currentYear) + "</div><span class=\"semesterCredits\">Credits: </span></div>";
            year.innerHTML += "<div id=\"" + global_noncollision++ + "\" class=\"semester\" ondrop=\"dropHandler(event, this)\" ondragover=\"dragOverHandler(event,this)\"><div class=\"semesterHeader\"><div class=\"term\">Spring " + (currentYear + 1) + "</div><span class=\"semesterCredits\">Credits: </span></div>";
            year.innerHTML += "<div id=\"" + global_noncollision++ + "\" class=\"semester\" ondrop=\"dropHandler(event, this)\" ondragover=\"dragOverHandler(event,this)\"><div class=\"semesterHeader\"><div class=\"term\">Summer " + (currentYear + 1) + "</div><span class=\"semesterCredits\">Credits: </span></div>";
        }

        currentYear++;
    }

    for (let semester of document.getElementsByClassName("semester")) {
        for (let course of plannedcourses) {
            if (course.term == "FA") term = "Fall";
            else if (course.term == "SP") term = "Spring";
            else term = "Summer";
            if (semester.getElementsByClassName("semesterHeader")[0].innerHTML.includes(course.year)
                && semester.getElementsByClassName("semesterHeader")[0].innerHTML.includes(term) ) {
                if (semester.classList.contains("semester-current")) {
                    semester.innerHTML += "<p id=\"" + global_noncollision++ + "\" class=\"course\"><span class=\"course-id\">" + course.course_id + "</span> " + course.name + "<span class=\"course-credits\">" + course.credits + "</span></p>";
                } else {
                    semester.innerHTML += "<p id=\"" + global_noncollision++ + "\" class=\"course\" draggable=\"true\" ondragstart=\"dragStartHandler(event)\"><span class=\"course-id\">" + course.course_id + "</span>\n" + course.name + "<span class=\"course-credits\">" + course.credits + "</span>\n</p>";
                }
            }
        }
    }
    for (let semester of document.getElementsByClassName("semester-past")) {
        for (let course of plannedcourses) {
            if (course.term == "FA") term = "Fall";
            else if (course.term == "SP") term = "Spring";
            else term = "Summer";
            if (semester.getElementsByClassName("semesterHeader")[0].innerHTML.includes(course.year) 
                && semester.getElementsByClassName("semesterHeader")[0].innerHTML.includes(term)) {
                semester.innerHTML += "<p class=\"course\" id=" + global_noncollision++ + "\"><span class=\"course-id\">" + course.course_id + "</span>\n" + course.name + "<span class=\"course-credits\">" + course.credits + "</span>\n<\p>";
            }
        }
    }
}

async function getPlanCourses() {
    let response = await fetch("http://localhost:3000/plan/plancourses/1");
    if (response.status < 400) return await response.json();
}

async function getAllCourses() {
    let response = await fetch("http://localhost:3000/student/courses/1");
    return await response.json();
  }

function setupHandlers() {
    jQuery("#jgradyBtn").click(function () {
        window.open("http://judah.cedarville.edu/~grady/cs3220.html", "_blank");
    });

    jQuery("#kdelsingBtn").click(function () {
        window.open("http://judah.cedarville.edu/~delsing/cs3220.html", "_blank");
    });

    jQuery("#lmillerBtn").click(function () {
        window.open("http://judah.cedarville.edu/~lmiller/cs3220.html", "_blank");
    });

    jQuery("#votingBtn").click(function () {
        window.open("http://judah.cedarville.edu/index.php", "_blank");
    });

    jQuery("#commitBtn").click(function () {
        window.open("https://github.com/arrxnov/TermProject/commit/6c48bad684b21b0be6cd02c1c9b5b55424312851", "_blank");
        jQuery("body").get(0).style.setProperty("--bg-theme", "var(--bg-sponsored)");
        jQuery("body").get(0).style.setProperty("--btn-theme", "var(--btn-sponsored)");
    });

    jQuery("#minerBtn").click(function () {
        window.open("", "_blank");
    });
}

function populateSearchTable(data) {
    jQuery("#searchTable").DataTable({
        paging: false,
        scrollCollapse: true,
        scrollY: 'calc(100vh - 60vh - 78px - 34px - 20px - 95px)',
        scrollX: false,
        layout: {
            topStart: 'search',
            topEnd: 'info',
            bottomStart: null,
            bottomEnd: null
        },
        data: Object.values(data),
        columns: [
            { data: 'id' },
            { data: 'name' },
            { data: 'credits' },
            { data: 'description', orderable: false }
        ]
    });
    rows = document.getElementById("searchTable").getElementsByTagName("tbody")[0].getElementsByTagName("tr");
    for (row of rows) {
        row.setAttribute("id", global_noncollision++);
        row.setAttribute("draggable", true);
        row.setAttribute("ondragstart", "dragStartHandler(event)");
        row.classList.add("table-member");
    }
}

function checkRequirements() {
    for (let coursereq of document.getElementsByClassName("req")) {
        let satisfied = false;
        for (let semester of document.getElementsByClassName("semester")) {
            for (let course of semester.getElementsByClassName("course")) {
                if (course.getElementsByClassName("course-id")[0].innerHTML === coursereq.getElementsByClassName("course-id")[0].innerHTML) {
                    satisfied = true;
                    break;
                }
            }
            if (satisfied) break;
        }

        for (let semester of document.getElementsByClassName("semester-past")) {
            for (let course of semester.getElementsByClassName("course")) {
                if (course.getElementsByClassName("course-id")[0].innerHTML === coursereq.getElementsByClassName("course-id")[0].innerHTML) {
                    satisfied = true;
                    break;
                }
            }
            if (satisfied) break;
        }
        if (!satisfied) coursereq.style.color = "red";
        else coursereq.style.color = "white";
    }
}

function dragStartHandler(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
    ev.dataTransfer.effectAllowed = "move";
}

function dropHandler(ev, el) {
    ev.preventDefault();
    const data = ev.dataTransfer.getData("text");
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

function dropTrash(ev) {
    ev.preventDefault();

    const element = ev.dataTransfer.getData("text");
    console.log(element);
    document.getElementById(element).remove();
    checkRequirements();
}

function dragOverHandler(ev) {
    ev.preventDefault();
}
