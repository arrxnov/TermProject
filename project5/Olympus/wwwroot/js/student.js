/*
 * Filename: student.js
 * Authors: Logan Miller, Jacob Grady, Kai Delsing
 */
let global_noncollision = "1";
jQuery(document).ready(function () {
    
    let years = {};
    let courseNames = {};

    setupHandlers();
    initPage(0);
});

async function initPage(plan_id) {
    populateSearchTable();
    populatePlanDropdown("d1eae408-2a14-4740-ba90-d2caedacee76"); // make id dynamic, just for POC purposes
    
    // use default parm in controller that defaults to logged in user's id
    // otherwise, pass the student id along from the faculty controller

    if (plan_id == 0) plan_id++; // default behavior
    populateHeader("d1eae408-2a14-4740-ba90-d2caedacee76", plan_id);
    populateCourses("d1eae408-2a14-4740-ba90-d2caedacee76", plan_id);

    //jQuery(function () {
    //    jQuery('ul.menu li').hover(function () {
    //        jQuery(this).children('ul').delay(10).slideDown(100);
    //    }, function(){
    //        jQuery(this).children('ul').delay(10).slideUp(100);
    //    });
    //});

    //let dropdownPlans = await getPlans();
    //let planDropdown = jQuery("#planSubMenu");
    //jQuery.each(dropdownPlans, function(name, id) {
    //    planDropdown.append(
    //        jQuery("<li></li>").html("<p>" + name + "</p>").attr("id", id)
    //    );
    //    jQuery("#" + id).click(function () {
    //        window.location.search = '?planId=' + id;
    //    });
    //});

    //let response = await getCombined(plan_id);

    //for (let course in response.catalog.courses) {
    //    courseNames[course] = {
    //        "name": response.catalog.courses[course].name,
    //        "credits": response.catalog.courses[course].credits
    //    };
    //}

    //let plan = response.plan;
    //planToYear(plan);
    //updateCourses(plan);
    //await updateReqs();
    //jQuery("#courseReqs").accordion({ collapsible: true, });
}

//async function getPlans() {
//    const response = await fetch("./get-plans.php");
//    const data = await response.json();
//    return data;
//}

//async function getCombined() {
//    if (!getUrlParameter("planId")) {
//        fetch_string = "./get-json.php";
//    } else {
//        fetch_string = "./get-json.php?" + new URLSearchParams({
//            planId: getUrlParameter("planId"),
//        });
//    }
//    const response = await fetch(fetch_string);
//    const data = await response.json();
//    return data;
//}

//async function getRequirements() {
//    if (!getUrlParameter("planId")) {
//        fetch_string = "./get-requirements.php";
//    } else {
//        fetch_string = "./get-requirements.php?" + new URLSearchParams({
//            planId: getUrlParameter("planId"),
//        });
//    }
//    const response = await fetch(fetch_string);
//    const data = await response.json();
//    return data;
//}

//function getCourseName(courseId) {
//    return courseNames[courseId].name;
//}

//function getCourseCredits(courseId) {
//    return courseNames[courseId].credits;
//}

//function planToYear(planJSON) {
//    for (let course in planJSON["courses"]) {
//        course = planJSON["courses"][course];
//        let y = course["year"];
//        let t = course["term"];
//        if (!(y in years)) {
//            years[y] = {
//                Fall: [],
//                Spring: [],
//                Summer: []
//            };
//        }
//        years[y][t].push(course);
//    }
//    return years;
//}

//async function updateReqs() {
//    reqs = await getRequirements();
//    for (let course in reqs.categories.Cognates.courses) {
//        course = reqs.categories.Cognates.courses[course];
//        let courseName = getCourseName(course);
//        document.getElementById("cognates").innerHTML += `<p id=${global_noncollision++} class=\"course\" draggable=\"true\" ondragstart=\"dragStartHandler2(event)\"> <span class=\"course-id\">` + course + "</span> " + courseName + "</p>";
//    }
//    for (let course in reqs.categories.Electives.courses) {
//        course = reqs.categories.Electives.courses[course];
//        let courseName = getCourseName(course);
//        document.getElementById("electives").innerHTML += `<p id=${global_noncollision++} class=\"course\" draggable=\"true\" ondragstart=\"dragStartHandler2(event)\"> <span class=\"course-id\">` + course + "</span> " + courseName + "</p>";
//    }
//    for (let course in reqs.categories.Core.courses) {
//        course = reqs.categories.Core.courses[course];
//        let courseName = getCourseName(course);
//        document.getElementById("core").innerHTML += `<p id=${global_noncollision++} class=\"course\" draggable=\"true\" ondragstart=\"dragStartHandler2(event)\"> <span class=\"course-id\">` + course + "</span> " + courseName + "</p>";
//    }
//    for (let course in reqs.categories.GenEds.courses) {
//        course = reqs.categories.GenEds.courses[course];
//        let courseName = getCourseName(course);
//        document.getElementById("geneds").innerHTML += `<p id=${global_noncollision++} class=\"course\" draggable=\"true\" ondragstart=\"dragStartHandler2(event)\"> <span class=\"course-id\">` + course + "</span> " + courseName + "</p>";
//    }
//}

//function updateCourses(planJSON) {
//    let header = document.getElementById("planHeader");
//    header.innerHTML = "";
//    header.innerHTML += "<p><strong>Student:</strong> " + planJSON["student"] + "</p>\n";
//    header.innerHTML += "<p><strong>Academic Plan:</strong> " + planJSON["name"] + "</p>\n";
//    let header2 = document.getElementById("planSubheader");
//    header2.innerHTML += "<p><strong>Major:</strong> " + planJSON["major"] + "</p>\n";
//    header2.innerHTML += "<p><strong>Minor:</strong> " + planJSON["minor"] + "</p>\n";
//    header2.innerHTML += "<p><strong>Catalog:</strong> " + planJSON["catYear"] + "</p>\n";
//    header2.innerHTML += "<p><strong>GPA:</strong> " + planJSON["gpa"] + "</p>\n";
//    header2.innerHTML += "<p><strong>Major GPA:</strong> " + planJSON["major_gpa"] + "</p>\n";

//    let totalCreds = 0;
//    let pastSemester = true;

//    for (let i = 1; i <= 12; i++) {
//        let semester = document.getElementById("semester" + i);
//        let base_y = planJSON["catYear"];
//        let y = parseInt(base_y) + parseInt((i + 1) / 3);
//        let t;
//        let term;

//        switch (i % 3) {
//            case 0:
//                t = "Summer";
//                term = "Summer";
//                break;
//            case 1:
//                t = "Fall";
//                term = "Fall";
//                break;
//            case 2:
//                t = "Spring";
//                term = "Spring";
//                break;
//        }

//        term += " " + y;
//        semester.getElementsByClassName("term")[0].innerHTML = term;

//        if (t == planJSON["currTerm"] && y == planJSON["currYear"]) {
//            semester.getElementsByClassName("term")[0].innerHTML += " (Current)";
//            currentSemester = true;
//            semester.classList.add("semester-current");
//            pastSemester = false;

//        }
//        else currentSemester = false;

//        if (pastSemester) {
//            semester.classList.remove("semester");
//            semester.classList.add("semester-past");
//        }

//        if (!(y in years)) {
//            continue;
//        }

//        let courses = years[y][t];
//        let credits = 0;

//        for (let key in courses) {
//            let course = courses[key];
//            credits += parseFloat(getCourseCredits(course["id"]));
//            let c_str = parseFloat(getCourseCredits(course["id"])).toPrecision(2);
//            if (!pastSemester && !currentSemester) {
//                semester.innerHTML += `<p id=${global_noncollision++} class=\"course\" draggable=\"true\" ondragstart=\"dragStartHandler(event)\"> <span class=\"course-id\">` + course["id"] + "</span> " + getCourseName(course["id"]) + "<span class=\"course-credits\">" + c_str + "</span>" + "</p>\n";
//            } else {
//                semester.innerHTML += `<p id=${global_noncollision++} class=\"course\"> <span class=\"course-id\">` + course["id"] + "</span> " + getCourseName(course["id"]) + "<span class=\"course-credits\">" + c_str + "</span>" + "</p>\n";
//            }
//        }

//        totalCreds += parseFloat(credits);
//        let year = semester.getElementsByClassName("credits")[0];
//        if (credits >= 10) {
//            year.innerHTML = "Credits: " + parseFloat(credits).toPrecision(3) + "";
//        } else {
//            year.innerHTML = "Credits: " + parseFloat(credits).toPrecision(2) + "";
//        }


//    }
//    let prec = 2;
//    if (totalCreds >= 10) {
//        prec = 3;
//    } else if (totalCreds >= 100) {
//        prec = 4;
//    }
//    header.innerHTML += "<p><strong>Total Hours:</strong> " + totalCreds.toPrecision(prec) + "</p>\n";
//}

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

async function populateSearchTable() {
    const response = await fetch("/api/studentdata/getallcourses");
    const data = await response.json();

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

async function populatePlanDropdown(userId) {

    const response = await fetch("/api/studentdata/getplans/" + userId);
    const dropdownPlans = await response.json();
    let planDropdown = jQuery("#planSubMenu");

    jQuery.each(dropdownPlans, function (id, name) {
        planDropdown.append(
            jQuery("<li></li>").html("<p>" + name + "</p>").attr("id", id)
        );
        //jQuery("#" + id).click(function () {
        //    window.location.search = '?planId=' + id; //fix search path, maybe just call js to reload requirements and planned courses, may need another api for plan metadata
        //});
    });
}

async function populateRequirements(userId, planId) {
    const response = await fetch("/api/studentdata/getrequirements/" + userId + "/" + planId);
    const requirements = await response.json();

}

async function populateCourses(userId, planId) {
    let response = await fetch("/api/studentdata/getplannedcourses/" + userId + "/" + planId);
    const plannedcourses = await response.json();



    
    response = await fetch("/api/studentdata/getallcourses");
    const allcourses = await response.json();
    for (plancourse of plannedcourses) {
        let course_id = plancourse["course_id"];
        let course_desc = "";
        let c_str = "";
        let found = false;
        for (course of allcourses) {
            if (course_id == course["id"]) {
                course_desc = course["description"];
                c_str = course["credits"];
                break;
            }
        }
        let year = plancourse["year"];
        console.log(year);
        let term = plancourse["term"];
        if (term == "FA") term = "Fall";
        else if (term == "SP") term = "Spring";
        else if (term == "SU") term = "Summer";
        else console.log("How did we get here");
        let future_semesters = document.getElementsByClassName("semester");
        for (let semester of future_semesters) {
            if (term in semester.getElementsByClassName("term")[0] && to_string(year) in semester.getElementsByClassName("term")[0]) {
                semester.innerHTML += `<p id=${global_noncollision++} class=\"course\" draggable=\"true\" ondragstart=\"dragStartHandler(event)\"> <span class=\"course-id\">` + course_id + "</span> " + course_desc + "<span class=\"course-credits\">" + c_str + "</span>" + "</p>\n";
                found = true;
                break;
            }
            else console.log("Evalled false");
        }
        if (found) continue;
        for (let semester of document.getElementsByClassName("semester-past")) {
            if (term in semester.getElementsByClassName("term")[0] && to_string(year) in semester.getElementsByClassName("term")[0]) {
                semester.innerHTML += `<p id=${global_noncollision++} class=\"course\"> <span class=\"course-id\">` + course_id + "</span> " + course_desc + "<span class=\"course-credits\">" + c_str + "</span>" + "</p>\n";
                found = true;
                break;
            }
            else console.log("Evalled false");
        }
        if (found) continue;
        let semester = document.getElementsByClassName("semester-current")[0];
        if (semester && term in semester.getElementsByClassName("term")[0] && to_string(year) in semester.getElementsByClassName("term")[0]) {
            semester.innerHTML += `<p id=${global_noncollision++} class=\"course\"> <span class=\"course-id\">` + course_id + "</span> " + course_desc + "<span class=\"course-credits\">" + c_str + "</span>" + "</p>\n";
        }
        else console.log("Evalled false");
    }
}

async function populateHeader(userId, planId) {
    const response = await fetch("/api/studentdata/getusermetadata/" + userId);
    const userdata = await response.json();
    let header = document.getElementById("planHeader");
    const planResponse = await fetch("/api/studentdata/getplanmetadata/" + userId + "/" + planId);
    const plandata = await planResponse.json();
    header.innerHTML += "<p><strong>Student:</strong> " + userdata[0]["name"] + "</p>";
    header.innerHTML += "<p><strong>Plan:</strong> " + plandata[0]["name"] + "</p>";
    header.innerHTML += "<p><strong>Total Hours:</strong> " + "</p>"; // TODO: FIXME
    let subheader = document.getElementById("planSubheader");
    subheader.innerHTML += "<p><strong>Major:</strong> " + plandata[0]["majors"][0] + "</p>";
    subheader.innerHTML += "<p><strong>Minor:</strong> " + plandata[0]["minors"][0] + "</p>";
    subheader.innerHTML += "<p><strong>Catalog:</strong> " + plandata[0]["catalog_year"] + "</p>";
    subheader.innerHTML += "<p><strong>GPA:</strong> " + userdata[0]["gpa"] + "</p>";
    subheader.innerHTML += "<p><strong>Major GPA</strong> " + userdata[0]["major_gpa"] + "</p>";
}

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
        let className = document.getElementById(data).childNodes[2].nodeValue;
        let classCredits = 3.0; // TODO: FIX
        el.innerHTML += "<p class=\"course\" id=" + global_noncollision++ + " draggable=true ondragstart=dragStartHandler(event)><span class=\"course-id\">" + classDescriptor + "</span>\n" + className + "<span class=\"course-credits\">" + classCredits + "</span>\n<\p>";
    } else {
        el.appendChild(document.getElementById(data));
    }
}

function dropHandler2(ev, el) {
    ev.preventDefault();
    document.getElementById(ev.dataTransfer.getData("Text")).parentElement.remove(document.getElementById(ev.dataTransfer.getData("Text")));
}

function dragOverHandler(ev) {
    ev.preventDefault();
}

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};