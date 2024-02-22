/*
 * Filename: form.js
 * Authors: Logan Miller, Jacob Grady, Kai Delsing
 * 
 * To Do's:
 *  Add dropdown for options with an entry for theme (change background color)
 *  Add drag and drop
 *  Update Logan's homepage --logan
 *  Update Jacob's page --jacob
 *  Remove all comments on js code
 *  Migrate code to jQuery
 *  Complete project part 1
 *  Complete project part 2
 */

/*
Improve the term project by adding AJAX and JQuery.

Specific guidelines:

Part 1: 

We are retrieving data from the web server using AJAX.  For this first part, data should be retrieved using JSON format.

Plan and Catalog data:   /~knoerr/cs3220/termProject/getCombined.php
Requirements data:        /~knoerr/cs3220/termProject/getRequirements.php
Plan and Catalog data is used to populate the 4-year plan (UR) and the Catalog Search table (LR) portion of the application. 

In the 4-year plan, the display should combine the course id (“CS-1210”) and the name (“C++ Programming”) to display both.

The Catalog search table should have columns for each of the properties for the courses in the catalog object.
The search box needs to dynamically reduce the table as more characters are entered in it. 
An example can be found at Datatables.net, but you can utilize any JavaScript mechanism for the table/search functionality.

Requirements data (UL) is displayed using a jQuery UI accordion widget and populated from the second AJAX call. 
Again, you will need to pull the name from the catalog object to display both id and name within the accordion. 
The Categories will be the section headers within the accordion.

Part 2:

Solve the Kelley Blue Book (KBB) problem using basic AJAX techniques from scratch (no jQuery). 
Data must be retrieved and processed using the XML format.  
Three new form widgets will be added to the LL region (along with your course and home page links).

The URI to call in this case is: /~gallaghd/ymm/ymmdb.php

Fetch the year data by adding the name/value pair: “fmt=xml” after the page loads to populate the year dropdown list.
Once a year is selected, that should automatically trigger another Ajax call, 
this time adding the selected year as a second parameter: “year=yr” and populate the make field.
Finally, selecting a make will also trigger an Ajax call, this time passing in a third parameter: “make=mk” and populating the model field.  
So, the complete URL will be something like:  /~gallaghd/ymm/ymmdb.php?fmt=xml&year=2008&make=4

Part 3:

Feel free to add any other cool features you like!

Regex fields from project 2 can be removed for this project.
*/

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

// Delay code execution until html is loaded
jQuery(document).ready(function() {

    async function getCombined() {
        const response = await fetch("/~knoerr/cs3220/termProject/getCombined.php");
        const data = await response.json();
        console.log(data);
        return data;
    }

    async function getRequirements() {
        const response = await fetch("/~knoerr/cs3220/termProject/getRequirements.php");
        const data = await response.json();
        return data;
    }

    function planToYear(planJSON) {
        for (let course in planJSON["courses"]) { // changed var to let
            course = planJSON["courses"][course];
            let y = course["year"];
            let t = course["term"];
            if (!(y in years)) {
                years[y] = {
                    Fall: [],
                    Spring: [],
                    Summer: []
                };
            }
            years[y][t].push(course);
        }
        return years;
    }

    function getCourseName(courseId) {
        return courseNames[courseId].name;
    }

    function getCourseCredits(courseId) {
        return courseNames[courseId].credits;
    }

    async function updateReqs() {
        reqs = await getRequirements();
        console.log(reqs);
        for (let course in reqs.categories.Cognates.courses) {
            course = reqs.categories.Cognates.courses[course];
            courseName = getCourseName(course);
            document.getElementById("cognates").innerHTML += "<p>" + course + " " + courseName + "</p>";
        }
        for (let course in reqs.categories.Electives.courses) {
            course = reqs.categories.Electives.courses[course];
            courseName = getCourseName(course);
            document.getElementById("electives").innerHTML += "<p>" + course + " " + courseName + "</p>";
        }
        for (let course in reqs.categories.Core.courses) {
            course = reqs.categories.Core.courses[course];
            courseName = getCourseName(course);
            document.getElementById("core").innerHTML += "<p>" + course + " " + courseName + "</p>";
        }
        for (let course in reqs.categories.GenEds.courses) {
            course = reqs.categories.GenEds.courses[course];
            courseName = getCourseName(course);
            document.getElementById("geneds").innerHTML += "<p>" + course + " " + courseName + "</p>";
        }
    }

    function updateCourses(planJSON) {
        let header = document.getElementById("planHeader");
        // DONE: set header values (other than total hours)
        header.innerHTML += "<p><strong>Student:</strong> " + planJSON["student"] + "</p>\n";
        header.innerHTML += "<p><strong>Course Plan:</strong> " + planJSON["currYear"] + "</p>\n";
        /*
        <div id="ur-header" class="labels">
            <p><strong>Student:</strong> loganmiller216</p>
            <p><strong>Course Plan:</strong> CS/CY Double Major</p>
            <p><strong>Total Hours:</strong> 137.5</p>
        </div>
        */

        let header2 = document.getElementById("planSubheader");
        // DONE: set header values
        header2.innerHTML += "<p><strong>Major:</strong> " + planJSON["major"] + "</p>\n";
        header2.innerHTML += "<p><strong>Minor:</strong> " + "Your Mom" + "</p>\n";
        header2.innerHTML += "<p><strong>Catalog:</strong> " + planJSON["catYear"] + "</p>\n";
        header2.innerHTML += "<p><strong>GPA:</strong> " + "42.0" + "</p>\n";
        header2.innerHTML += "<p><strong>Major GPA:</strong> " + "42.42" + "</p>\n";
        
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
            let base_y = planJSON["catYear"];
            let y = parseInt(base_y) + parseInt((i+1)/3);
            let t;
            let term;

            // set term values
            switch(i%3) {
                case 0: 
                    t = "Summer";
                    term = "Summer";
                    break;
                case 1:
                    t = "Fall";
                    term = "Fall";
                    break;
                case 2:
                    t = "Spring";
                    term = "Spring";
                    break; 
            }

            term += " " + y;
            if (semester.getElementsByClassName("term")[0].innerHTML != term) {
                semester.getElementsByClassName("term")[0].innerHTML = term;
            }
            if (t == planJSON["currTerm"] && y == planJSON["currYear"]) {
                semester.getElementsByClassName("term")[0].innerHTML += " (Current)";
                semester.style.outline = "2px solid black";
                
            }
            if (!(y in years)) {
                continue;
            }

            let courses = years[y][t];
            let credits = 0;

            for (let key in courses) {
                let course = courses[key];
                credits += getCourseCredits(course["id"]);
                // DONE: append course to semester div
                semester.innerHTML += "<p draggable=\"true\">" + course["id"] + " " + getCourseName(course["id"]) + "</p>\n";
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
    let courseNames = {};
    async function doThings() {
        let response = await getCombined();

        for (let course in response.catalog.courses) {
            courseNames[course] = {
                "name": response.catalog.courses[course].name,
                "credits": response.catalog.courses[course].credits
            };

        }
        console.log("courseNames:");
        console.log(courseNames);

        let plan = response.plan;
        console.log("doThings:");

        console.log("Plan:");
        console.log(plan);
        // console.log(response)
        // console.log(plan);
        planToYear(plan);
        console.log("Years");
        console.log(years);
        updateCourses(plan);
        await updateReqs();
        jQuery("#courseReqs").accordion();
    }
    doThings();

    // Function which blinks the vote button
    jQuery(".blink").each(function() {
        let elem = jQuery(this);
        setInterval(function() {
            if (elem.css("color") == "rgb(255, 0, 0)") {
                elem.css("color", "var(--text-color-light)");
            } else {
                elem.css("color", "red");
            }    
        }, 400);
    });

    // Functions that handle button clicks
    jQuery("#jgradyBtn").click(function() {
        window.open("http://judah.cedarville.edu/~grady/cs3220.html", "_blank");
    });
    jQuery("#kdelsingBtn").click(function() {
        window.open("http://judah.cedarville.edu/~delsing/cs3220.html", "_blank");
    });
    jQuery("#lmillerBtn").click(function() {
        window.open("http://judah.cedarville.edu/~lmiller/cs3220.html", "_blank");
    });
    jQuery("#votingBtn").click(function() {
        window.open("http://judah.cedarville.edu/index.php", "_blank");
    });

    jQuery("#courseFinderForm").on("input", checkCourseFinderForm);

    jQuery("#car-year").on("input", updateKBB);
    jQuery("#make").on("input", updateKBB);
    jQuery("#model").on("input", updateKBB);

    jQuery("#courseFinderSubmit").click(async function(event) {
        event.preventDefault();
    
        if (checkCourseFinderForm()) {
            let response = await fetch("http://judah.cedarville.edu/echo.php", {
                method: "POST",
                body: new FormData(document.getElementById("courseFinderForm"))
             });
             
             let result = await response.text();
             alert(result);
        }
    });
    
    function checkCourseFinderForm() {
        const deptRegex = /^$|^[a-zA-z]{1,5}$/;
        const numRegex = /^$|^\d{1,4}$/;
        const titleRegex = /^[a-zA-Z0-9 ():\-\[\]]{1,50}$/;
        const creditsRegex = /^([1-9]{1,2})(\.[05])?$/;
    
        let courseDeptWidget = document.getElementById("courseDept");
        let courseNumWidget = document.getElementById("courseNum");
        let courseTitleWidget = document.getElementById("courseTitle");
        let courseCreditsWidget = document.getElementById("courseCredits");
        
        
        let deptValid = checkWidget(courseDeptWidget, deptRegex);
        let numValid = checkWidget(courseNumWidget, numRegex);
        let titleValid = checkWidget(courseTitleWidget, titleRegex);
        let creditsValid = checkWidget(courseCreditsWidget, creditsRegex);

        let validValues = deptValid && numValid && titleValid && creditsValid;

        let courseFinderFormEmpty = (!courseDeptWidget.value.trim() && 
                                     !courseNumWidget.value.trim() && 
                                     !courseTitleWidget.value.trim() && 
                                     !courseCreditsWidget.value.trim());

        let valid = validValues && !courseFinderFormEmpty;

        if (valid) {
            jQuery("#courseFinderSubmit").removeClass("btn").addClass("btn-clickable");
        } else {
            jQuery("#courseFinderSubmit").addClass("btn").removeClass("btn-clickable");
        }
        
        return valid;
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

    function updateKBB() {

    }

    // add code to create new dataTable
    let table = jQuery('#searchTable').dataTable().api(); //dataTable() returns a jQuery object

    table.rows.add(getCombined())

});