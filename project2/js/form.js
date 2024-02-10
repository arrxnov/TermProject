/*
Create a JavaScript Plan object containing the following fields:
Plan name
Catalog year
Major
Student name
Current semester (all prior semesters considered “history.”)
An array of Course objects, each with term, year, course designator, and course name.



Replace the static HTML in the UR div with dynamic data stored in your Year objects.
Appearance should remain the same, and still use the same CSS.
*/

// Course = {
//     term: "",
//     year: "",
//     course_des: "",
//     course_name: "",
//     credits: 0
// };
// 
// Plan = {
//     plan_name: "",
//     catalog_year: "",
//     major: "",
//     minor: "",
//     gpa: "",
//     student_name: "",
//     current_semester: "",
//     courses: {}
// };
//Plan = {
//    year: {}
//}
//
// Year = {
//     terms: {}
// }
// 
// Term = {
//     courses: []
// }

function planToYear(planJSON) {
    for (var course in planJSON["courses"]) {
        course = planJSON["courses"][course];
        let y = course["year"];
        let t = course["term"];
        if (!(y in years)) {
            years[y] = {
                FA: [],
                SP: [],
                SU: []
            };
        }
        years[y][t].push(course);
    }
    return years;
}


function updateCourses(planJSON) {
    let header = document.getElementById("ur-header");
    // DONE: set header values (other than total hours)
    header.innerHTML += "<p><strong>Student:</strong> " + planJSON["student_name"] + "</p>\n";
    header.innerHTML += "<p><strong>Course Plan:</strong> " + planJSON["year"] + "</p>\n";
    /*
    <div id="ur-header" class="labels">
        <p><strong>Student:</strong> loganmiller216</p>
        <p><strong>Course Plan:</strong> CS/CY Double Major</p>
        <p><strong>Total Hours:</strong> 137.5</p>
    </div>
    */

    let header2 = document.getElementById("ur-header-2");
    // DONE: set header values
    header2.innerHTML += "<p><strong>Major:</strong> " + planJSON["major"] + "</p>\n";
    header2.innerHTML += "<p><strong>Minor:</strong> " + planJSON["minor"] + "</p>\n";
    header2.innerHTML += "<p><strong>Catalog:</strong> " + planJSON["catalog_year"] + "</p>\n";
    header2.innerHTML += "<p><strong>GPA:</strong> " + planJSON["gpa"] + "</p>\n";
    header2.innerHTML += "<p><strong>Major GPA:</strong> " + planJSON["major_gpa"] + "</p>\n";
    
    /*
    <div id="ur-header-2" class="labels">
        <p><strong>Major:</strong> Computer Science, Cyber Operations</p>
        <p><strong>Minor:</strong> Bible</p>
        <p><strong>Catalog:</strong> 2021</p>
        <p><strong>GPA:</strong> 3.60</p>
        <p><strong>Major GPA:</strong> 3.55</p>
    </div>
    */
    let totalCreds = 0;

    for (let i=1; i<=12; i++) {
        let semester = document.getElementById("semester"+i);
        let base_y = planJSON["catalog_year"];
        let y = parseInt(base_y) + parseInt((i+1)/3);
        let t;
        let term;
        switch(i%3) {
            case 0: 
                t = "SU";
                term = "Summer";
                break;
            case 1:
                t = "FA";
                term = "Fall";
                break;
            case 2:
                t = "SP";
                term = "Spring";
                break; 
        }
        term += " " + y;
        if (semester.getElementsByClassName("term")[0].innerHTML != term) {
            semester.getElementsByClassName("term")[0].innerHTML = term;
        }
        if ("" + t + y == planJSON["current_semester"]) {
            semester.getElementsByClassName("term")[0].innerHTML += " (Current)";
        }
        if (!(y in years)) {
            continue;
        }
        let courses = years[y][t];
        let credits = 0;
        for (let key in courses) {
            let course = courses[key];
            credits += course["credits"];
            // DONE: append course to semester div
            semester.innerHTML += "<p>" + course["course_des"] + " " + course["course_name"] + "</p>\n";
        }
        
        totalCreds += credits;
        // DONE: set credits div
        let year = semester.getElementsByClassName("credits")[0];
        year.innerHTML = "Credits: " + credits + "";

        /*
        <div id="semester1" class="semester fall">
            <div class="semester-hdr">
                <div class="term">Fall 2021</div>
                <div class="credits">Credits: 16</div>
            </div>
            <p>MATH-1710 Calculus I</p>
            <p>CS-1210 C++ Programming</p>
            <p>EGCP-1010 Digital Logic Design</p>
            <p>COM-1100 Fundamentals of Speech</p>
            <p>BTGE-1725 Bible & the Gospel</p>
        </div>
        */
        
    }
    header.innerHTML += "<p><strong>Total Hours:</strong> " + totalCreds + "</p>\n";
}

let years = {};
async function doThings() {
    const response = await fetch("./plan.json");
    const json = await response.json();
    planToYear(json);
    updateCourses(json);
}
doThings();

// Course finder form validation and submission --------------------------------
let courseDeptWidget = document.getElementById("courseDept");
let courseNumWidget = document.getElementById("courseNum");
let courseTitleWidget = document.getElementById("courseTitle");
let courseCreditsWidget = document.getElementById("courseCredits");
let courseFinderForm = document.getElementById("courseFinderForm");
let courseFinderSubmitBtn = document.getElementById("courseFinderSubmit");

courseFinderForm.addEventListener("input", checkCourseFinderForm);
courseFinderForm.addEventListener("submit", submitCourseFinderForm);

async function submitCourseFinderForm(event) {
    event.preventDefault();

    let courseFinderFormEmpty = (!courseDeptWidget.value.trim() && 
                                 !courseNumWidget.value.trim() && 
                                 !courseTitleWidget.value.trim() && 
                                 !courseCreditsWidget.value.trim());

    if (checkCourseFinderForm(event) && !courseFinderFormEmpty) {
        let response = await fetch("http://judah.cedarville.edu/echo.php", {
            method: "POST",
            body: new FormData(courseFinderForm)
         });
         
         let result = await response.text();
         alert(result);
    }
}

function checkCourseFinderForm(event) {
    const deptRegex = /^$|^[a-zA-z]{1,5}$/;
    const numRegex = /^$|^\d{1,4}$/;
    const titleRegex = /^[a-zA-Z0-9 ():\-\[\]]{1,50}$/;
    const creditsRegex = /^([1-9]{1,2})(\.[05])?$/;

    let deptValid = checkWidget(courseDeptWidget, deptRegex);
    let numValid = checkWidget(courseNumWidget, numRegex);
    let titleValid = checkWidget(courseTitleWidget, titleRegex);
    let creditsValid = checkWidget(courseCreditsWidget, creditsRegex);
    
    return deptValid && numValid && titleValid && creditsValid;
}

function checkWidget(courseWidget, regex) {
    let courseValue = courseWidget.value.trim();

    if (courseValue.match(regex) || (courseValue == "")) {
        courseWidget.style.setProperty("outline", "none");
        return true;
        
    } else {
        courseWidget.style.setProperty("outline", "solid red 1px");
        return false;
    }
}

// function checkCourseDept() {
//     let regex = /^$|^[a-zA-z]{1,5}$/;
//     let courseDeptValue = courseDeptWidget.value.trim();

//     if (courseDeptValue.match(regex) || (courseDeptValue == "")) {
//         courseDeptWidget.style.setProperty("outline", "none");
//         return true;

//     } else {
//         courseDeptWidget.style.setProperty("outline", "solid red 1px");
//         return false;
//     }
// }

// function checkCourseNum() {
//     let regex = /^$|^\d{1,4}$/;
//     let courseNumValue = courseNumWidget.value.trim();
//     if (courseNumValue != "") {
//         courseFinderFormEmpty = false;
//     }
//     courseNumValid = courseNumValue.match(regex) || (courseNumValue == "");
//     if (!courseNumValid) {
//         courseNumWidget.style.setProperty("outline", "solid red 1px");
//     } else {
//         courseNumWidget.style.setProperty("outline", "none");
//     }
// }

// function checkCourseTitle() {
//     let regex = /^[a-zA-Z0-9 ():\-\[\]]{1,50}$/;
//     let courseTitleValue = courseTitleWidget.value.trim();
//     if (courseTitleValue != "") {
//         courseFinderFormEmpty = false;
//     }
//     courseTitleValid = courseTitleValue.match(regex) || (courseTitleValue == "");
//     if (!courseTitleValid) {
//         courseTitleWidget.style.setProperty("outline", "solid red 1px");
//     } else {
//         courseTitleWidget.style.setProperty("outline", "none");
//     }
// }

// function checkCourseCredits() {
//     let regex = /^([1-9]{1,2})(\.[05])?$/;
//     let courseCreditsValue = courseCreditsWidget.value.trim();
//     if (courseCreditsValue != "") {
//         courseFinderFormEmpty = false;
//     }
//     courseCreditsValid = courseCreditsValue.match(regex) || (courseCreditsValue == "");
//     if (!courseCreditsValid) {
//         courseCreditsWidget.style.setProperty("outline", "solid red 1px");
//     } else {
//         courseCreditsWidget.style.setProperty("outline", "none");
//     }
// }
