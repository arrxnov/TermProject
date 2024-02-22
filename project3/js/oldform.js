jQuery("#courseFinderForm").on("input", checkCourseFinderForm);

jQuery("#courseFinderSubmit").click(async function (event) {
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
        const creditsRegex = /^([0-9]{1,2})(\.[05])?$/;

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