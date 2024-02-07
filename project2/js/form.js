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



// // TODO: figure out why this doesn't validate properly
// function validateForm() {
//     console.log("Validating");
//     const termRE = new RegExp("(SP|SU|FA)");
//     const yearRE = new RegExp("[0-2][0-9]{3}");

//     const deptRE = new RegExp("[A-Z]{2,5}-[0-9]{4}");

//     // TODO: combine the dept des and number form fields

//     let form = document.forms["course_finder"]
//     if (!termRE.test(form["course_dept"])) {
//         alert("Course Dept. invalid");
//         console.log("course_dept invalid");
//         return false;
//     } 
    
//     else if (form["course_title"].value == "") {
//         alert("Course Title must be filled out");
//         console.log("course_title empty");
//         return false;
//     }


//     else if (form["course_num"].value == "") {
//         alert("Course Number must be filled out");
//         console.log("coursenum empty");
//         return false;
//     }  else if (!termRE.test(form["term"])) {
//         alert("Invalid course term");
//         console.log("term empty");
//         return false;
//     } else if (!yearRE.test(form["year"])) {
//         alert("Invalid course year");
//         console.log("year empty");
//         return false;
//     }
// }

// Check data validity on change
let courseNumValid = false;
let courseNumWidget = document.querySelector("#courseNum");
courseNumWidget.addEventListener("input", checkCourseNum);

let courseTitleValid = false;
let courseTitleWidget = document.querySelector("#courseTitle");
courseTitleWidget.addEventListener("input", checkCourseTitle);

let courseCreditsValid = false;
let courseCreditsWidget = document.querySelector("#courseCredits");
courseCreditsWidget.addEventListener("input", checkCourseCredits);

function checkCourseNum() {
   let regex = /^\D\D-\d\d\d\d$/;
   let courseNum = courseNumWidget.value.trim();
   courseNumValid = courseNum.match(regex);
}

function checkCourseTitle() {
    let regex = /^.*$/; // don't allow <
    let courseTitle = courseTitleWidget.value.trim();
    courseTitleValid = courseTitle.match(regex);
 }

 function checkCourseCredits() {
    let regex = /^\d{1,2}\.\d$/;
    let courseCredits = courseCreditsWidget.value.trim();
    courseCreditsValid = courseCredits.match(regex);
 }

// Check data validity on submit
// let courseFinderForm = document.querySelector("#courseFinderForm");
// courseFinderForm.addEventListener("submit", checkCourseFinderForm);

function submitCourseFinderForm() {
   if (!courseNumValid || !courseTitleValid || !courseCreditsValid) {
      console.log("invalid form data");
      console.log("courseNumValid: " + courseNumValid);
      console.log("courseTitleValid: " + courseTitleValid);
      console.log("courseCreditsValid: " + courseCreditsValid);
   } else {
        console.log("successful submission");
   }
   
}

