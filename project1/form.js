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
    course_name: ""
};

Plan = {
    plan_name: "",
    catalog_year: "",
    major: "",
    student_name: "",
    current_semester: "",
    courses: {}
};



/*
Convert the Course objects into a new Year object, which contains Terms containing Courses. In other words, just re-organize the data by year and term.
*/
Year = {
    year: "",
    spring: {},
    summer: {},
    fall: {}
};

function validateForm() {
    const termRE = new RegExp("((S|s)pring|(S|s)ummer|(F|f)all)");
    const yearRE = new RegExp("[1-2][0-9]{3}");

    let form = document.forms["courseform"]
    if (form["coursenum"].value == "") {
        alert("Course Number must be filled out");
        return false;
    } else if (form["coursename"].value == "") {
        alert("Course Name must be filled out");
        return false;
    } else if (termRE.test(form["term"])) {

    } else if (yearRE.test(form["year"])) {
    }
}