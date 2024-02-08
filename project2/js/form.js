/*
Create a JavaScript Plan object containing the following fields:
Plan name
Catalog year
Major
Student name
Current semester (all prior semesters considered “history.”)
An array of Course objects, each with term, year, course designator, and course name.



Replace the static HTML in the UR div with dynamic data stored in your Year objects. Appearance should remain the same, and still use the same CSS.
*/

Course = {
    term: "",
    year: "",
    course_des: "",
    course_name: "",
    credits: 0
};

Plan = {
    plan_name: "",
    catalog_year: "",
    major: "",
    minor: "",
    gpa: "",
    student_name: "",
    current_semester: "",
    courses: {}
};

// let data = {};

function planToYear(planJSON) {
    let years = {};
    years.push({
        "9999": {
            plan_name:          planJSON["plan_name"],
            catalog_year:       planJSON["catalog_year"],
            major:              planJSON["major"],
            minor:              planJSON["minor"],
            gpa:                planJSON["gpa"],
            major_gpa:          planJSON["major_gpa"],
            student_name:       planJSON["student_name"],
            current_semester:   planJSON["current_semester"],
        }
    });
}

//     for (var course in planJSON["courses"]) {
//         let y = course["year"];
//         let t = course["term"];

//         if (!(y in years)) {
//             years.push({
//                 y: {
//                     FA: {},
//                     SP: {},
//                     SU: {}
//                 }
//             })
//         }

//         years[y][t].push(course);
//     }

//     return years;
// }


function updateCourses(years) {
    let header = document.getElementById("#ur-header");
    // TODO: set header values (other than total hours)
    
    header.innerHTML += "<p><strong>Student</strong> " + years["9999"].student_name + "</p>\n";
    header.innerHTML += "<p><strong>Course Plan:</strong> " + years["9999"].year + "</p>\n";
    /*
    <div id="ur-header" class="labels">
        <p><strong>Student:</strong> loganmiller216</p>
        <p><strong>Course Plan:</strong> CS/CY Double Major</p>
        <p><strong>Total Hours:</strong> 137.5</p>
    </div>
    */

    let header2 = document.getElementById("#ur-header-2");
    // TODO: set header values
    header2.innerHTML += "<p><strong>Major:</strong> " + years["9999"].major + "</p>\n";
    header2.innerHTML += "<p><strong>Minor:</strong> " + years["9999"].minor + "</p>\n";
    header2.innerHTML += "<p><strong>Catalog:</strong> " + years["9999"].catalog_year + "</p>\n";
    header2.innerHTML += "<p><strong>GPA:</strong> " + years["9999"].gpa + "</p>\n";
    header2.innerHTML += "<p><strong>Major GPA:</strong> " + years["9999"].major_gpa + "</p>\n";
    
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

    for (let i=1; i<13; i++) {
        let semester = document.getElementById("#semester"+i);
        let base_y = years["9999"]["catalog_year"];
        let y = base_y + int((i+1)/3);
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

        let courses = years[y][t];
        let credits = 0;
        for (let course in courses) {
            credits += course["credits"];
            // DONE: append course to semester div
            semester.innerHTML += "<p>" + course.course_des + " " + course.course_name + "</p>\n";
        }
        totalCreds += credits;
        // DONE: set credits div
        let year = semester.getElementsByClassName("credits")[0];
        year.textContent = "Credits: " + credits;

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

// Widget and validation variables
let courseFinderFormEmpty = true;

let courseDeptValid = false;
let courseDeptWidget = document.getElementById("courseDept");

let courseNumValid = false;
let courseNumWidget = document.getElementById("courseNum");

let courseTitleValid = false;
let courseTitleWidget = document.getElementById("courseTitle");

let courseCreditsValid = false;
let courseCreditsWidget = document.getElementById("courseCredits");

let courseFinderForm = document.getElementById("courseFinderForm");

// Register course finder form event handlers
courseFinderForm.addEventListener("submit", submitCourseFinderForm);
courseFinderForm.addEventListener("change", checkCourseFinderForm);

// Check data validity on change
function checkCourseFinderForm(event) {
    checkCourseDept();
    checkCourseNum();
    checkCourseTitle();
    checkCourseCredits();    
    
    if (!courseDeptValid || !courseNumValid || !courseTitleValid || !courseCreditsValid) {
        return false;
    } 
    return true;
}

// Check data validity on submit
function submitCourseFinderForm(event) {
    if (!checkCourseFinderForm(event) || courseFinderFormEmpty) {
        console.log("invalid form data");
        event.preventDefault();
    } else {
        event.target.submit();
    }

    // Reevaluate form after return if there was an error
    courseFinderFormEmpty = true;
    checkCourseFinderForm(event);
}

// Validation functions
function checkCourseDept() {
    let regex = /^[a-zA-z]{1,5}$/;
    let courseDeptValue = courseDeptWidget.value.trim();
    if (courseDeptValue != "") {
        courseFinderFormEmpty = false;
    }
    courseDeptValid = courseDeptValue.match(regex) || (courseDeptValue == "");
    if (!courseDeptValid) {
        courseDeptWidget.style.setProperty("border-style", "solid");
    } else {
        courseDeptWidget.style.setProperty("border-style", "hidden");
    }
}

function checkCourseNum() {
    let regex = /^\d{1,4}$/;
    let courseNumValue = courseNumWidget.value.trim();
    if (courseNumValue != "") {
        courseFinderFormEmpty = false;
    }
    courseNumValid = courseNumValue.match(regex) || (courseNumValue == "");
    if (!courseNumValid) {
        courseNumWidget.style.setProperty("border-style", "solid");
    } else {
        courseNumWidget.style.setProperty("border-style", "hidden");
    }
}

function checkCourseTitle() {
    let regex = /^[a-zA-Z0-9 ():\-\[\]]{1,50}$/;
    let courseTitleValue = courseTitleWidget.value.trim();
    if (courseTitleValue != "") {
        courseFinderFormEmpty = false;
    }
    courseTitleValid = courseTitleValue.match(regex) || (courseTitleValue == "");
    if (!courseTitleValid) {
        courseTitleWidget.style.setProperty("border-style", "solid");
    } else {
        courseTitleWidget.style.setProperty("border-style", "hidden");
    }
}

function checkCourseCredits() {
    let regex = /^([1-9]{1,2})(\.[05])?$/;
    let courseCreditsValue = courseCreditsWidget.value.trim();
    if (courseCreditsValue != "") {
        courseFinderFormEmpty = false;
    }
    courseCreditsValid = courseCreditsValue.match(regex) || (courseCreditsValue == "");
    if (!courseCreditsValid) {
        courseCreditsWidget.style.setProperty("border-style", "solid");
    } else {
        courseCreditsWidget.style.setProperty("border-style", "hidden");
    }
}