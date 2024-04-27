/*
 * Filename: student.js
 * Authors: Logan Miller, Jacob Grady, Kai Delsing
 */

let global_noncollision = "1";
let uid_length = 36;
let plan_id = "";
jQuery(document).ready(function () {

    // let years = {};
    // let courseNames = {};

    // plan_id = sessionStorage.getItem("planId");
    // sessionStorage.setItem("planId", "");

    setupHandlers();
    initPage();
});

// function getUid() {
//     return window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
// }

// function getPlanId() {
//     return plan_id;
// }

async function getData1() {
    let response = await fetch("/api/studentdata/getallcourses");
    const allCourseData = await response.json();

    response = await fetch("/api/studentdata/getusermetadata/" + getUid());
    const userMetadata = await response.json();

    response = await fetch("/api/studentdata/getplans/" + getUid());
    const plans = await response.json();

    return [allCourseData, userMetadata, plans];
}

// async function getData2(planId) {
//     let response = await fetch("/api/studentdata/getplanmetadata/" + getUid() + "/" + planId);
//     const planMetadata = await response.json();

//     response = await fetch("/api/studentdata/getplannedcourses/" + getUid() + "/" + planId);
//     const plannedCourses = await response.json();

//     response = await fetch("/api/studentdata/getrequirements/" + getUid() + "/" + planId);
//     const requirements = await response.json();

//     return [planMetadata, plannedCourses, requirements];
// }

async function initPage() {
    let data1 = await getData1();

    // let planId = getPlanId();

    // if (!planId) {
    //     planId = data1[1][0]["default_plan_id"];
    // }

    // let data2 = await getData2(planId)

    let allCourseData = data1[0];
    // let userMetadata = data1[1][0];
    // let plans = data1[2];
    // let planMetadata = data2[0][0];
    // let plannedCourses = data2[1];
    // let requirements = data2[2];

    populateSearchTable(allCourseData);
    // populatePlanDropdown(plans)
    // populateHeader(userMetadata, planMetadata);
    // populateYears(plannedCourses);
    // populateCourses(plannedCourses, allCourseData);
    // populateRequirements(requirements, allCourseData);

    jQuery("#courseReqs").accordion({ collapsible: true, });

    document.getElementById("cognates").setAttribute("ondragover", "dragOverHandler(event)");
    document.getElementById("core").setAttribute("ondragover", "dragOverHandler(event)");
    document.getElementById("electives").setAttribute("ondragover", "dragOverHandler(event)");
    document.getElementById("geneds").setAttribute("ondragover", "dragOverHandler(event)");

    document.getElementById("cognates").setAttribute("ondrop", "dropTrash(event, this)");
    document.getElementById("core").setAttribute("ondrop", "dropTrash(event, this)");
    document.getElementById("electives").setAttribute("ondrop", "dropTrash(event, this)");
    document.getElementById("geneds").setAttribute("ondrop", "dropTrash(event, this)");

    for (let course in document.getElementsByClassName("course")) {
        course.onmouseup = function (event) {
            if (event.which == 3) {
                remove(event.target);
                checkRequirements();
            }
        }
    }
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

function populatePlanDropdown(plans) {
    let planDropdown = jQuery("#planSubMenu");

    jQuery.each(plans, function (id, plan) {
        var name = plan["name"];
        var id = plan["id"];
        planDropdown.append(
            jQuery("<li></li>").html("<p>" + name + "</p>").attr("id", id)
        );
        jQuery("#" + id).click(async function () {
            sessionStorage.setItem("planId", id);
            window.location.reload();
        });
    });
}

// function populateYears(plannedcourses) {
//     let minYear = 0;
//     let maxYear = 0;
//     for (let course of plannedcourses) {
//         if (minYear == 0 || course["year"] < minYear) minYear = course["year"];
//         if (maxYear == 0 || course["year"] > maxYear) maxYear = course["year"];
//     }

//     for (let i = minYear; i < maxYear; i += 1) {
//         document.getElementById("plan").innerHTML += "<div id=\"year" + i + "\" class=\"year\"></div>";
//     }
//     let currentYear = minYear;
//     for (let year of document.getElementsByClassName("year")) {
//         if (currentYear < 2024) {
//             year.innerHTML += "<div id=\"" + global_noncollision++ + "\" class=\"semester-past\"><div class=\"semesterHeader\"><div class=\"term\">Fall " + (currentYear) + "</div><span class=\"semesterCredits\">Credits: </span></div>";
//             year.innerHTML += "<div id=\"" + global_noncollision++ + "\" class=\"semester-past\"><div class=\"semesterHeader\"><div class=\"term\">Spring " + (currentYear + 1) + "</div><span class=\"semesterCredits\">Credits: </span></div>";
//             year.innerHTML += "<div id=\"" + global_noncollision++ + "\" class=\"semester-past\"><div class=\"semesterHeader\"><div class=\"term\">Summer " + (currentYear + 1) + "</div><span class=\"semesterCredits\">Credits: </span></div>";
//         } else if (currentYear == 2024) {
//             year.innerHTML += "<div id=\"" + global_noncollision++ + "\" class=\"semester-past\" ondrop=\"dropHandler(event, this)\" ondragover=\"dragOverHandler(event,this)\"><div class=\"semesterHeader\"><div class=\"term\">Fall " + (currentYear) + "</div><span class=\"semesterCredits\">Credits: </span></div>";
//             year.innerHTML += "<div id=\"" + global_noncollision++ + "\" class=\"semester semester-current\" ondrop=\"dropHandler(event, this)\" ondragover=\"dragOverHandler(event,this)\"><div class=\"semesterHeader\"><div class=\"term\">Spring " + (currentYear + 1) + "</div><span class=\"semesterCredits\">Credits: </span></div>";
//             year.innerHTML += "<div id=\"" + global_noncollision++ + "\" class=\"semester\" ondrop=\"dropHandler(event, this)\" ondragover=\"dragOverHandler(event,this)\"><div class=\"semesterHeader\"><div class=\"term\">Summer " + (currentYear + 1) + "</div><span class=\"semesterCredits\">Credits: </span></div>";

//         } else {
//             year.innerHTML += "<div id=\"" + global_noncollision++ + "\" class=\"semester\" ondrop=\"dropHandler(event, this)\" ondragover=\"dragOverHandler(event,this)\"><div class=\"semesterHeader\"><div class=\"term\">Fall " + (currentYear) + "</div><span class=\"semesterCredits\">Credits: </span></div>";
//             year.innerHTML += "<div id=\"" + global_noncollision++ + "\" class=\"semester\" ondrop=\"dropHandler(event, this)\" ondragover=\"dragOverHandler(event,this)\"><div class=\"semesterHeader\"><div class=\"term\">Spring " + (currentYear + 1) + "</div><span class=\"semesterCredits\">Credits: </span></div>";
//         }

//         currentYear++;
//     }
// }

// function populateRequirements(requirements, allcourses) {
//     let course_desc = "";
//     for (let req of requirements) {
//         for (let course of allcourses) {
//             if (course["id"] == req["course_id"]) {
//                 course_desc = course["name"];
//                 break;
//             }
//         }
//         if (req["type"] == "core") {
//             document.getElementById("core").innerHTML += "<p id=\"" + global_noncollision++ + "\" class=\"course req\" draggable=True ondragstart=\"dragStartHandler(event, this)\"><span class=\"course-id\">" + req["course_id"] + "</span> " + course_desc + "</p>\n";
//         } else if (req["type"] == "gened") {
//             document.getElementById("geneds").innerHTML += "<p id=\"" + global_noncollision++ + "\" class=\"course req\" draggable=True ondragstart=\"dragStartHandler(event, this)\"><span class=\"course-id\">" + req["course_id"] + "</span> " + course_desc + "</p>\n";
//         } else if (req["type"] == "elective") {
//             document.getElementById("electives").innerHTML += "<p id=\"" + global_noncollision++ + "\" class=\"course req\" draggable=True ondragstart=\"dragStartHandler(event, this)\"><span class=\"course-id\">" + req["course_id"] + "</span> " + course_desc + "</p>\n";
//         } else if (req["type"] == "cognate") {
//             document.getElementById("cognates").innerHTML += "<p id=\"" + global_noncollision++ + "\" class=\"course req\" draggable=True ondragstart=\"dragStartHandler(event, this)\"><span class=\"course-id\">" + req["course_id"] + "</span> " + course_desc + "</p>\n";
//         }
//     }

//     checkRequirements();
// }

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

// function populateCourses(plannedcourses, allcourses) {
//     for (plancourse of plannedcourses) {
//         let course_id = plancourse["course_id"];
//         let course_desc = "";
//         let c_str = "";
//         let found = false;
//         for (let course of allcourses) {
//             if (course_id == course["id"]) {
//                 course_desc = course["name"];
//                 c_str = course["credits"];
//                 break;
//             }
//         }
//         let year = plancourse["year"];
//         let term = plancourse["term"];
//         if (term == "FA") term = "Fall";
//         else if (term == "SP") term = "Spring";
//         else if (term == "SU") term = "Summer";

//         let future_semesters = document.getElementsByClassName("semester");
//         for (let semester of future_semesters) {
//             if (semester.getElementsByClassName("term")[0].innerHTML.indexOf(term) !== -1 && (semester.getElementsByClassName("term"))[0].innerHTML.indexOf(year) !== -1) {
//                 semester.innerHTML += `<p id=${global_noncollision++} class=\"course\" draggable=\"true\" ondragstart=\"dragStartHandler(event)\"> <span class=\"course-id\">` + course_id + "</span> " + course_desc + "<span class=\"course-credits\">" + c_str + "</span>" + "</p>\n";
//                 found = true;
//                 break;
//             }
//         }
//         if (found) continue;
//         for (let semester of document.getElementsByClassName("semester-past")) {
            
//             if (semester.getElementsByClassName("term")[0].innerHTML.indexOf(term) !== -1 && (semester.getElementsByClassName("term")[0]).innerHTML.indexOf(year) !== -1) {
//                 semester.innerHTML += `<p id=${global_noncollision++} class=\"course\"> <span class=\"course-id\">` + course_id + "</span> " + course_desc + "<span class=\"course-credits\">" + c_str + "</span>" + "</p>\n";
//                 found = true;
//                 break;
//             }
//         }
//         if (found) continue;
//         let semester = document.getElementsByClassName("semester-current")[0];
        
//         if (semester.getElementsByClassName("term")[0].innerHTML.indexOf(term) !== -1 && (semester.getElementsByClassName("term")[0]).innerHTML.indexOf(year) !== -1) {
//             semester.innerHTML += `<p id=${global_noncollision++} class=\"course\"> <span class=\"course-id\\` + course_id + "</span> " + course_desc + "<span class=\"course-credits\">" + c_str + "</span>" + "</p>\n";
//         }
//     }
//     checkRequirements();
// }

// function populateHeader(userdata, plandata) {
//     let header = document.getElementById("planHeader");
//     header.innerHTML += "<p><strong>Student:</strong> " + userdata["name"] + "</p>";
//     header.innerHTML += "<p><strong>Plan:</strong> " + plandata["name"] + "</p>";
//     header.innerHTML += "<p><strong>Total Hours:</strong> " + "</p>"; // TODO: FIXME
//     let subheader = document.getElementById("planSubheader");
//     subheader.innerHTML += "<p><strong>Major:</strong> " + plandata["majors"][0] + "</p>";
//     subheader.innerHTML += "<p><strong>Minor:</strong> " + plandata["minors"][0] + "</p>";
//     subheader.innerHTML += "<p><strong>Catalog:</strong> " + plandata["catalog_year"] + "</p>";
//     subheader.innerHTML += "<p><strong>GPA:</strong> " + userdata["gpa"] + "</p>";
//     subheader.innerHTML += "<p><strong>Major GPA</strong> " + userdata["major_gpa"] + "</p>";
// }

function dragStartHandler(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
    ev.dataTransfer.effectAllowed = "move";
}

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

function dropTrash(ev, el) {
    ev.preventDefault();
    const data = ev.dataTransfer.getData("Text");
    document.getElementById(data).remove();
    checkRequirements();
}

function dragOverHandler(ev) {
    ev.preventDefault();
}

// var getUrlParameter = function getUrlParameter(sParam) {
//     var sPageURL = decodeURIComponent(window.location.search.substring(1)),
//         sURLVariables = sPageURL.split('&'),
//         sParameterName,
//         i;

//     for (i = 0; i < sURLVariables.length; i++) {
//         sParameterName = sURLVariables[i].split('=');

//         if (sParameterName[0] === sParam) {
//             return sParameterName[1] === undefined ? true : sParameterName[1];
//         }
//     }
// };