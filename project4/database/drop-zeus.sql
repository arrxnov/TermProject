-- Created by Vertabelo (http://vertabelo.com)
-- Last modification date: 2024-03-03 01:26:57.523

-- foreign keys
ALTER TABLE zeus_catalog_course
    DROP FOREIGN KEY catalog_catalog;

ALTER TABLE zeus_catalog_course
    DROP FOREIGN KEY catalog_course;

ALTER TABLE zeus_concentration_course
    DROP FOREIGN KEY concentration_course_concentration;

ALTER TABLE zeus_concentration_course
    DROP FOREIGN KEY concentration_courses_course;

ALTER TABLE zeus_concentration
    DROP FOREIGN KEY concentrations_majors;

ALTER TABLE zeus_gened
    DROP FOREIGN KEY gened_catalog;

ALTER TABLE zeus_gened
    DROP FOREIGN KEY gened_course;

ALTER TABLE zeus_major
    DROP FOREIGN KEY major_catalog;

ALTER TABLE zeus_major_course
    DROP FOREIGN KEY major_course;

ALTER TABLE zeus_major_course
    DROP FOREIGN KEY major_courses;

ALTER TABLE zeus_minor
    DROP FOREIGN KEY minor_catalog;

ALTER TABLE zeus_minor_course
    DROP FOREIGN KEY minor_courses;

ALTER TABLE zeus_minor_course
    DROP FOREIGN KEY minor_courses_course;

ALTER TABLE zeus_plan
    DROP FOREIGN KEY plan_user;

ALTER TABLE zeus_planned_concentration
    DROP FOREIGN KEY planned_concentration_concentration;

ALTER TABLE zeus_planned_concentration
    DROP FOREIGN KEY planned_concentration_plan;

ALTER TABLE zeus_planned_course
    DROP FOREIGN KEY planned_courses_course;

ALTER TABLE zeus_planned_course
    DROP FOREIGN KEY planned_courses_plan;

ALTER TABLE zeus_planned_major
    DROP FOREIGN KEY planned_major_major;

ALTER TABLE zeus_planned_major
    DROP FOREIGN KEY planned_major_plan;

ALTER TABLE zeus_planned_minor
    DROP FOREIGN KEY planned_minor_minor;

ALTER TABLE zeus_planned_minor
    DROP FOREIGN KEY planned_minor_plan;

ALTER TABLE zeus_prereq
    DROP FOREIGN KEY prereqs_course1;

ALTER TABLE zeus_prereq
    DROP FOREIGN KEY prereqs_course2;

-- tables
DROP TABLE zeus_catalog;

DROP TABLE zeus_catalog_course;

DROP TABLE zeus_concentration;

DROP TABLE zeus_concentration_course;

DROP TABLE zeus_course;

DROP TABLE zeus_gened;

DROP TABLE zeus_major;

DROP TABLE zeus_major_course;

DROP TABLE zeus_minor;

DROP TABLE zeus_minor_course;

DROP TABLE zeus_plan;

DROP TABLE zeus_planned_concentration;

DROP TABLE zeus_planned_course;

DROP TABLE zeus_planned_major;

DROP TABLE zeus_planned_minor;

DROP TABLE zeus_prereq;

DROP TABLE zeus_user;

-- End of file.

