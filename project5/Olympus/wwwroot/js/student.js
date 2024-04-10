/*
 * Filename: student.js
 * Authors: Logan Miller, Jacob Grady, Kai Delsing
 */

let global_noncollision = "1";
jQuery(document).ready(function () {

    let years = {};
    let courseNames = {};

    setupHandlers();
    initPage();
});

function getUid() {
    return window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
}

async function getData1() {
    let response = await fetch("/api/studentdata/getallcourses");
    const allCourseData = await response.json();

    response = await fetch("/api/studentdata/getusermetadata/" + getUid());
    const userMetadata = await response.json();

    response = await fetch("/api/studentdata/getplans/" + getUid());
    const plans = await response.json();

    return [allCourseData, userMetadata, plans];
}

async function getData2(planId) {
    response = await fetch("/api/studentdata/getplanmetadata/" + getUid() + "/" + planId);
    const planMetadata = await response.json();

    response = await fetch("/api/studentdata/getplannedcourses/" + getUid() + "/" + planId);
    const plannedCourses = await response.json();

    response = await fetch("/api/studentdata/getrequirements/" + getUid() + "/" + planId);
    const requirements = await response.json();

    return [planMetadata, plannedCourses, requirements];
}

async function initPage() {
    data1 = await getData1();
    data2 = await getData2(data1[1][0]["default_plan_id"])

    var allCourseData = data1[0];
    var userMetadata = data1[1][0];
    var plans = data1[2];
    var planMetadata = data2[0][0];
    var plannedCourses = data2[1];
    var requirements = data2[2];

    console.log(allCourseData);
    console.log(userMetadata);
    console.log(plans);
    console.log(planMetadata);
    console.log(plannedCourses);
    console.log(requirements);

    populateSearchTable(allCourseData);
    populatePlanDropdown(plans)
    populateHeader(userMetadata, planMetadata);
    populateYears(plannedCourses);
    populateCourses(plannedCourses, allCourseData);
    populateRequirements(requirements, allCourseData);

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
        var name = plan["name"]
        planDropdown.append(
            jQuery("<li></li>").html("<p>" + name + "</p>").attr("id", id)
        );
        //jQuery("#" + id).click(function () {
        //    window.location.search = '?planId=' + id; //fix search path, maybe just call js to reload requirements and planned courses, may need another api for plan metadata
        //});
    });
}

function populateYears(plannedcourses) {
    let minYear = 0;
    let maxYear = 0;
    for (let course of plannedcourses) {
        if (minYear == 0 || course["year"] < minYear) minYear = course["year"];
        if (maxYear == 0 || course["year"] > maxYear) maxYear = course["year"];
    }

    for (let i = minYear; i < maxYear; i += 1) {
        document.getElementById("plan").innerHTML += "<div id=\"year" + i + "\" class=\"year\"></div>";
    }
    let currentYear = minYear;
    let calyear = 2024;
    let calTerm = "SP";
    for (let year of document.getElementsByClassName("year")) {
        year.innerHTML += "<div id=\"" + global_noncollision++ + "\" class=\"semester\"><div class=\"semesterHeader\"><div class=\"term\">Fall " + (currentYear) + "<span class=\"semesterCredits\"></span></div>";
        year.innerHTML += "<div id=\"" + global_noncollision++ + "\" class=\"semester\"><div class=\"semesterHeader\"><div class=\"term\">Spring " + (currentYear+1) + "<span class=\"semesterCredits\"></span></div>";
        year.innerHTML += "<div id=\"" + global_noncollision++ + "\" class=\"semester\"><div class=\"semesterHeader\"><div class=\"term\">Summer " + (currentYear+1) + "<span class=\"semesterCredits\"></span></div>";
    }
}

function populateRequirements(requirements, allcourses) {
    let course_desc = "";
    /*
    let allcoursesAry = [];
    console.log(allcourses);
    console.log(typeof (allcourses));
    console.log(allcourses.length);

    console.log(allcourses[0].length);
    
    for (let i = 0; i < allcourses.length; i++) {
        var temp = [...allcourses[0]];
        console.log(temp);
        temp.push(allcourses[i][0]);
        temp.Add(allcourses[i][1]);
        temp.Add(allcourses[i][2]);
        allcoursesList.Add(temp);
    }
    
    console.log(allcoursesAry);
    console.log(typeof (allcoursesAry));
    console.log(allcoursesAry[0]);
    console.log(typeof (allcoursesAry[0]));
    //[allcoursesList[0]];
    //console.log(allcoursesList);
    */
    for (let req of requirements) {
        for (let course of allcourses) {
            if (course["id"] == req["course_id"]) {
                course_desc = course["description"];
                break;
            }
        }
        if (req["type"] == "core") {
            document.getElementsByClassName("core").innerHTML += "<p id=\"" + global_noncollision++ + "\" class=\"course req\" draggable=True ondragstart=\"dragStartHandler(event, this)\"><span class=\"course-id\">" + req["course_id"] + "</span>" + course_desc + "</p>\n";
        } else if (req["type"] == "gened") {
            document.getElementsByClassName("geneds").innerHTML += "<p id=\"" + global_noncollision++ + "\" class=\"course req\" draggable=True ondragstart=\"dragStartHandler(event, this)\"><span class=\"course-id\">" + req["course_id"] + "</span>" + course_desc + "</p>\n";
        } else if (req["type"] == "elective") {
            document.getElementsByClassName("electives").innerHTML += "<p id=\"" + global_noncollision++ + "\" class=\"course req\" draggable=True ondragstart=\"dragStartHandler(event, this)\"><span class=\"course-id\">" + req["course_id"] + "</span>" + course_desc + "</p>\n";
        } else if (req["type"] == "cognate") {
            document.getElementsByClassName("cognates").innerHTML += "<p id=\"" + global_noncollision++ + "\" class=\"course req\" draggable=True ondragstart=\"dragStartHandler(event, this)\"><span class=\"course-id\">" + req["course_id"] + "</span>" + course_desc + "</p>\n";
        }
    }

    checkRequirements();
}

function checkRequirements() {
    for (coursereq of document.getElementsByClassName("req")) {
        let satisfied = false;
        for (semester of document.getElementsByClassName("semester")) {
            for (course of semester.getElementsByClassName("course")) {
                if (course.getElementsByClassName("course-id")[0].innerHTML == coursereq.getElementsByClassName("course-id")[0].innerHTML) {
                    satisfied = true;
                    break;
                }
            }
            if (satisfied) break;
        }
        if (!satisfied) coursereq.style.color = red;
        else coursereq.style.color = white;
    }
}

function populateCourses(plannedcourses, allcourses) {
    for (plancourse of plannedcourses) {
        let course_id = plancourse["course_id"];
        let course_desc = "";
        let c_str = "";
        let found = false;
        for (let course of allcourses) {
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
            console.log(semester);
            if (term in semester.getElementsByClassName("term") && (year) in semester.getElementsByClassName("term")) {
                semester.innerHTML += `<p id=${global_noncollision++} class=\"course\" draggable=\"true\" ondragstart=\"dragStartHandler(event)\"> <span class=\"course-id\">` + course_id + "</span> " + course_desc + "<span class=\"course-credits\">" + c_str + "</span>" + "</p>\n";
                found = true;
                break;
            }
            else console.log("Evaling false");
        }
        if (found) continue;
        for (let semester of document.getElementsByClassName("semester-past")) {
            console.log(semester);
            if (term in semester.getElementsByClassName("term") && (year) in semester.getElementsByClassName("term")) {
                semester.innerHTML += `<p id=${global_noncollision++} class=\"course\"> <span class=\"course-id\">` + course_id + "<span> " + course_desc + "<span class=\"course-credits\">" + c_str + "</span>" + "</p>\n";
                found = true;
                break;
            }
            else console.log("Evaling false");
        }
        if (found) continue;
        let semester = document.getElementsByClassName("semester-current")[0];
        console.log(semester);
        console.log((year));
        console.log(term);
        if (semester && term in semester.getElementsByClassName("term")[0] && (year) in semester.getElementsByClassName("term")[0]) {
            semester.innerHTML += `<p id=${global_noncollision++} class=\"course\"> <span class=\"course-id\\` + course_id + "</span> " + course_desc + "<span class=\"course-credits\">" + c_str + "</span>" + "</p>\n";
        }
        else console.log("Evaling false");
    }
}

function populateHeader(userdata, plandata) {
    console.log(userdata);
    console.log(plandata);
    let header = document.getElementById("planHeader");
    header.innerHTML += "<p><strong>Student:</strong> " + userdata["name"] + "</p>";
    header.innerHTML += "<p><strong>Plan:</strong> " + plandata["name"] + "</p>";
    header.innerHTML += "<p><strong>Total Hours:</strong> " + "</p>"; // TODO: FIXME
    let subheader = document.getElementById("planSubheader");
    subheader.innerHTML += "<p><strong>Major:</strong> " + plandata["majors"][0] + "</p>";
    subheader.innerHTML += "<p><strong>Minor:</strong> " + plandata["minors"][0] + "</p>";
    subheader.innerHTML += "<p><strong>Catalog:</strong> " + plandata["catalog_year"] + "</p>";
    subheader.innerHTML += "<p><strong>GPA:</strong> " + userdata["gpa"] + "</p>";
    subheader.innerHTML += "<p><strong>Major GPA</strong> " + userdata["major_gpa"] + "</p>";
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
    checkRequirments();
}

function dropHandler2(ev, el) {
    ev.preventDefault();
    document.getElementById(ev.dataTransfer.getData("Text")).parentElement.remove(document.getElementById(ev.dataTransfer.getData("Text")));
}

function dragOverHandler(ev) {
    ev.preventDefault();
}

for (let course in document.getElementsByClassName("course")) {
    course.onmouseup = function(event) {
        if (event.which == 3) {
            removeElement(event.target);
            checkRequirements();
        }
    }
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