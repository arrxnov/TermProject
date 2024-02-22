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
*/

jQuery(document).ready(function () {

    let years = {};
    let courseNames = {};
    doThings();
    initKbbYear();
    populateSearchTable();

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

    jQuery("#car-year").on("input", async function() {
        let year = document.getElementById("car-year").value;
        if (year) {
            document.getElementById("make").innerHTML = '<option selected="true" style="display: none"></option>';
            let makes = await getMakesByYear(year);
            for (let make of makes) {
                document.getElementById("make").innerHTML += "<option>" + make + "</option>";
            }
            document.getElementById("make").removeAttribute("disabled");
        }
        else {
            document.getElementById("make").setAttribute("disabled");
        }
        document.getElementById("model").setAttribute("disabled", "true");
        document.getElementById("model").innerHTML = '<option selected="true" style="display: none"></option>';
    });

    jQuery("#make").on("input", async function() {
        let make = document.getElementById("make").value;
        if (make) {
            document.getElementById("model").innerHTML = '<option selected="true" style="display: none"></option>';
            let year = document.getElementById("car-year").value;
            let models = await getModelsByMakeAndYear(await idFromMake(make, year), year);
            for (let model of models) {
                document.getElementById("model").innerHTML += "<option>" + model + "</option>";
            }
            document.getElementById("model").removeAttribute("disabled");
        }
        else {
            document.getElementById("model").setAttribute("disabled", "true");
        }
    });

    jQuery(".blink").each(function () {
        let elem = jQuery(this);
        setInterval(function () {
            if (elem.css("color") == "rgb(255, 0, 0)") {
                elem.css("color", "var(--text-color-light)");
            } else {
                elem.css("color", "red");
            }
        }, 400);
    });

    async function doThings() {
        let response = await getCombined();

        for (let course in response.catalog.courses) {
            courseNames[course] = {
                "name": response.catalog.courses[course].name,
                "credits": response.catalog.courses[course].credits
            };
        }

        let plan = response.plan;
        planToYear(plan);
        updateCourses(plan);
        await updateReqs();
        jQuery("#courseReqs").accordion();
        jQuery("#miscBox").accordion();
    }

    async function getCombined() {
        const response = await fetch("/~knoerr/cs3220/termProject/getCombined.php");
        const data = await response.json();
        return data;
    }

    async function getRequirements() {
        const response = await fetch("/~knoerr/cs3220/termProject/getRequirements.php");
        const data = await response.json();
        return data;
    }

    function getCourseName(courseId) {
        return courseNames[courseId].name;
    }

    function getCourseCredits(courseId) {
        return courseNames[courseId].credits;
    }

    function planToYear(planJSON) {
        for (let course in planJSON["courses"]) {
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

    async function updateReqs() {
        reqs = await getRequirements();
        for (let course in reqs.categories.Cognates.courses) {
            course = reqs.categories.Cognates.courses[course];
            let courseName = getCourseName(course);
            document.getElementById("cognates").innerHTML += "<p>" + course + " " + courseName + "</p>";
        }
        for (let course in reqs.categories.Electives.courses) {
            course = reqs.categories.Electives.courses[course];
            let courseName = getCourseName(course);
            document.getElementById("electives").innerHTML += "<p>" + course + " " + courseName + "</p>";
        }
        for (let course in reqs.categories.Core.courses) {
            course = reqs.categories.Core.courses[course];
            let courseName = getCourseName(course);
            document.getElementById("core").innerHTML += "<p>" + course + " " + courseName + "</p>";
        }
        for (let course in reqs.categories.GenEds.courses) {
            course = reqs.categories.GenEds.courses[course];
            let courseName = getCourseName(course);
            document.getElementById("geneds").innerHTML += "<p>" + course + " " + courseName + "</p>";
        }
    }

    function updateCourses(planJSON) {
        let header = document.getElementById("planHeader");
        header.innerHTML += "<p><strong>Student:</strong> " + planJSON["student"] + "</p>\n";
        header.innerHTML += "<p><strong>Course Plan:</strong> " + planJSON["currYear"] + "</p>\n";

        let header2 = document.getElementById("planSubheader");
        header2.innerHTML += "<p><strong>Major:</strong> " + planJSON["major"] + "</p>\n";
        header2.innerHTML += "<p><strong>Minor:</strong> " + "Your Mom" + "</p>\n";
        header2.innerHTML += "<p><strong>Catalog:</strong> " + planJSON["catYear"] + "</p>\n";
        header2.innerHTML += "<p><strong>GPA:</strong> " + "42.0" + "</p>\n";
        header2.innerHTML += "<p><strong>Major GPA:</strong> " + "42.42" + "</p>\n";

        let totalCreds = 0;

        for (let i = 1; i <= 12; i++) {
            let semester = document.getElementById("semester" + i);
            let base_y = planJSON["catYear"];
            let y = parseInt(base_y) + parseInt((i + 1) / 3);
            let t;
            let term;

            switch (i % 3) {
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
                semester.innerHTML += "<p draggable=\"true\">" + course["id"] + " " + getCourseName(course["id"]) + "</p>\n";
            }

            totalCreds += credits;
            let year = semester.getElementsByClassName("credits")[0];
            year.innerHTML = "Credits: " + credits + "";

        }
        header.innerHTML += "<p><strong>Total Hours:</strong> " + totalCreds + "</p>\n";
    }

    async function initKbbYear() {
        document.getElementById("car-year").innerHTML = '<option selected="true" style="display: none"></option>';
        let model_years = await getYears();
        for (let yr of model_years) {
            document.getElementById("car-year").innerHTML += '<option>' + yr + '</option>';
        }
    }

    async function idFromMake(make, year) {
        let ids = [];
        let makes = [];

        await fetch("/~gallaghd/ymm/ymmdb.php?fmt=xml&year=" + year)
            .then(response => response.text())
            .then(text => {
                let parser = new DOMParser();
                let xml = parser.parseFromString(text, "text/xml");
                let temp_ids = xml.getElementsByTagName("id");
                for (let i = 0; i < temp_ids.length; i++) {
                    ids.push(temp_ids[i].innerHTML);
                }

                let temp_makes = xml.getElementsByTagName("name");
                for (let i = 0; i < temp_makes.length; i++) {
                    makes.push(temp_makes[i].innerHTML);
                }

            });
        
        let relation = {};
        for(let i=0; i<ids.length; i++) {
            relation[makes[i]] = ids[i];
        }
        return relation[make];

    }

    async function getYears() {
        let model_years = [];
        await fetch("http://judah.cedarville.edu/~gallaghd/ymm/ymmdb.php?fmt=xml")
            .then(response => response.text())
            .then(text => {
                let parser = new DOMParser();
                let xml = parser.parseFromString(text, "text/xml");
                let temp_years = xml.getElementsByTagName("year");
                for (let i = 0; i < temp_years.length; i++) {
                    model_years.push(temp_years[i].innerHTML);
                }
            });
        return model_years;
    }

    async function getMakesByYear(year) {
        makes = [];
        await fetch("/~gallaghd/ymm/ymmdb.php?fmt=xml&year=" + year)
            .then(response => response.text())
            .then(text => {
                let parser = new DOMParser();
                let xml = parser.parseFromString(text, "text/xml");
                let temp_makes = xml.getElementsByTagName("name");
                for (let i = 0; i < temp_makes.length; i++) {
                    makes.push(temp_makes[i].innerHTML);
                }
            });
        return makes;
    }
    
    async function getModelsByMakeAndYear(id, year) {
        models = [];
        await fetch("/~gallaghd/ymm/ymmdb.php?fmt=xml&year=" + year + "&make=" + id)
        .then(response => response.text())
        .then(text => {
            let parser = new DOMParser();
            let xml = parser.parseFromString(text, "text/xml");
            let temp_models = xml.getElementsByTagName("name");
            for (let i = 0; i < temp_models.length; i++) {
                models.push(temp_models[i].innerHTML);
            }
        });
        return models;
    }
    
    async function populateSearchTable() {
        let response = await getCombined();

        jQuery("#searchTable").DataTable( {
            data: Object.values(response.catalog.courses),
            columns: [
                { data: 'id' },
                { data: 'name' },
                { data: 'credits' },
                { data: 'description', orderable: false }
            ]
        } );
    }
});

var setMint = function() {
    jQuery("body").get(0).style.setProperty("--bg-theme", "var(--bg-mint)");
    jQuery("body").get(0).style.setProperty("--btn-theme", "var(--btn-mint)");
}

var setAtlantis = function() {
    jQuery("body").get(0).style.setProperty("--bg-theme", "var(--bg-atlantis)");
    jQuery("body").get(0).style.setProperty("--btn-theme", "var(--btn-atlantis)");
}