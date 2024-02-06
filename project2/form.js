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
    student_name: "",
    current_semester: "",
    courses: {}
};

let data = {};

function planToYear(planJSON) {
    let years = {};
    years.push({
        "9999": {
            plan_name:          planJSON["plan_name"],
            catalog_year:       planJSON["catalog_year"],
            major:              planJSON["major"],
            student_name:       planJSON["student_name"],
            current_semester:   planJSON["current_semester"],
        }
    });

    for (var course in planJSON["courses"]) {
        let y = course["year"];
        let t = course["term"];

        if (!(y in years)) {
            years.push({
                y: {
                    FA: {},
                    SP: {},
                    SU: {}
                }
            })
        }

        years[y][t].push(course);
    }

    return years;
}


function updateCourses(years) {
    let header = document.getElementById("#ur-header");
    /*
    <div id="ur-header" class="labels">
        <p><strong>Student:</strong> loganmiller216</p>
        <p><strong>Course Plan:</strong> CS/CY Double Major</p>
        <p><strong>Total Hours:</strong> 137.5</p>
    </div>
    */

   let header2 = document.getElementById("#ur-header-2");
    /*
    <div id="ur-header-2" class="labels">
        <p><strong>Major:</strong> Computer Science, Cyber Operations</p>
        <p><strong>Minor:</strong> Bible</p>
        <p><strong>Catalog:</strong> 2021</p>
        <p><strong>GPA:</strong> 3.60</p>
        <p><strong>Major GPA:</strong> 3.55</p>
    </div>
    */

    
}


/*
fetch('C:\Users\\manic\\Documents\\GitHub\\web-term-project\\project2\\plan.json')
    .then(response => response.json())
    .then(data => {
        console.log('Data from JSON file:', data);
    })
    .catch(error => {
        console.error('Error reading file:', error);
    })

    
console.log('Real data from JSON file:', data);
*/

/*
Convert the Course objects into a new Year object, which contains Terms containing Courses. In other words, just re-organize the data by year and term.
*/


function validateForm() {
    const termRE = new RegExp("(SP|SU|FA)");
    const yearRE = new RegExp("[0-2][0-9]{3}");

    let form = document.forms["courseform"]
    if (form["coursenum"].value == "") {
        alert("Course Number must be filled out");
        return false;
    } else if (form["coursename"].value == "") {
        alert("Course Name must be filled out");
        return false;
    } else if (!termRE.test(form["term"])) {
        alert("Invalid course term");
        return 
    } else if (!yearRE.test(form["year"])) {
        alert("Invalid course year");
        return 
    }
}

