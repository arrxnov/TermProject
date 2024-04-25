# web-term-project
Web Applications Term Project Sp 24

# SQL
SELECT (
    SELECT name
    FROM plan
    WHERE id = 1
) AS name,
(
    SELECT GROUP_CONCAT(major.name)
    FROM plannedmajor INNER JOIN major ON plannedmajor.major_id=major.id
    WHERE plannedmajor.plan_id = 1
) AS majors,
(
    SELECT GROUP_CONCAT(minor.name)
    FROM plannedminor INNER JOIN minor ON plannedminor.minor_id=minor.id
    WHERE plannedminor.plan_id = 1
) AS minors,
(
    SELECT catalog_year
    FROM plan
    WHERE id = 1
) AS catalog_year;


SELECT plannedcourse.course_id, course.credits, plannedcourse.year, plannedcourse.term
FROM plannedcourse INNER JOIN course ON plannedcourse.course_id=course.id
WHERE plannedcourse.plan_id = 1;
