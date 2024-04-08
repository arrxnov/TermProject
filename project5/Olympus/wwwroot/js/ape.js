/*
 * Filename: ape.js
 * Authors: Logan Miller, Jacob Grady, Kai Delsing
 */

jQuery(document).ready(function () {
    let dropdownThemes = {
        Mint: 'mint',
        Atlantis: 'atlantis',
        Avenue: 'avenue'
    };

    let themeDropdown = jQuery("#themeSubMenu");

    jQuery.each(dropdownThemes, function (name, id) {
        themeDropdown.append(
            jQuery("<li></li>").html("<p>" + name + "</p>").attr("id", id)
        );
        jQuery("#" + id).click(function () {
            jQuery("body").get(0).style.setProperty("--bg-theme", "var(--bg-" + id + ")");
            jQuery("body").get(0).style.setProperty("--btn-theme", "var(--btn-" + id + ")");
        });
    });

    jQuery(function () {
        jQuery('ul.menu li').hover(function () {
            jQuery(this).children('ul').delay(10).slideDown(100);
        }, function () {
            jQuery(this).children('ul').delay(10).slideUp(100);
        });
    });

    jQuery("#login").click(function () {
        window.open("/Identity/Account/Login", "_self");
    });

    jQuery("#register").click(function () {
        window.open("/Identity/Account/Register", "_self");
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
});