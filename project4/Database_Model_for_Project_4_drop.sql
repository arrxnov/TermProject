-- Created by Vertabelo (http://vertabelo.com)
-- Last modification date: 2024-02-28 04:37:59.455

-- foreign keys
ALTER TABLE catalog_courses
    DROP FOREIGN KEY catalog_catalog;

ALTER TABLE catalog_courses
    DROP FOREIGN KEY catalog_course;

ALTER TABLE concentration_course
    DROP FOREIGN KEY concentration_course_concentration;

ALTER TABLE concentration_course
    DROP FOREIGN KEY concentration_courses_course;

ALTER TABLE concentration
    DROP FOREIGN KEY concentrations_majors;

ALTER TABLE gened
    DROP FOREIGN KEY gened_catalog;

ALTER TABLE gened
    DROP FOREIGN KEY gened_course;

ALTER TABLE major
    DROP FOREIGN KEY major_catalog;

ALTER TABLE major_course
    DROP FOREIGN KEY major_course;

ALTER TABLE major_course
    DROP FOREIGN KEY major_courses;

ALTER TABLE minor
    DROP FOREIGN KEY minor_catalog;

ALTER TABLE minor_course
    DROP FOREIGN KEY minor_courses;

ALTER TABLE minor_course
    DROP FOREIGN KEY minor_courses_course;

ALTER TABLE plan
    DROP FOREIGN KEY plan_user;

ALTER TABLE planned_courses
    DROP FOREIGN KEY planned_courses_course;

ALTER TABLE planned_courses
    DROP FOREIGN KEY planned_courses_plan;

ALTER TABLE prereqs
    DROP FOREIGN KEY prereqs_course1;

ALTER TABLE prereqs
    DROP FOREIGN KEY prereqs_course2;

-- tables
DROP TABLE catalog;

DROP TABLE catalog_courses;

DROP TABLE concentration;

DROP TABLE concentration_course;

DROP TABLE course;

DROP TABLE gened;

DROP TABLE major;

DROP TABLE major_course;

DROP TABLE minor;

DROP TABLE minor_course;

DROP TABLE plan;

DROP TABLE planned_courses;

DROP TABLE prereqs;

DROP TABLE user;

-- End of file.

