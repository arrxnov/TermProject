-- Created by Vertabelo (http://vertabelo.com)
-- Last modification date: 2024-03-03 00:52:12.5

-- foreign keys
ALTER TABLE catalog_course
    DROP FOREIGN KEY catalog_catalog;

ALTER TABLE catalog_course
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

ALTER TABLE planned_concentration
    DROP FOREIGN KEY planned_concentration_concentration;

ALTER TABLE planned_concentration
    DROP FOREIGN KEY planned_concentration_plan;

ALTER TABLE planned_course
    DROP FOREIGN KEY planned_courses_course;

ALTER TABLE planned_course
    DROP FOREIGN KEY planned_courses_plan;

ALTER TABLE planned_major
    DROP FOREIGN KEY planned_major_major;

ALTER TABLE planned_major
    DROP FOREIGN KEY planned_major_plan;

ALTER TABLE planned_minor
    DROP FOREIGN KEY planned_minor_minor;

ALTER TABLE planned_minor
    DROP FOREIGN KEY planned_minor_plan;

ALTER TABLE prereq
    DROP FOREIGN KEY prereqs_course1;

ALTER TABLE prereq
    DROP FOREIGN KEY prereqs_course2;

-- tables
DROP TABLE catalog;

DROP TABLE catalog_course;

DROP TABLE concentration;

DROP TABLE concentration_course;

DROP TABLE course;

DROP TABLE gened;

DROP TABLE major;

DROP TABLE major_course;

DROP TABLE minor;

DROP TABLE minor_course;

DROP TABLE plan;

DROP TABLE planned_concentration;

DROP TABLE planned_course;

DROP TABLE planned_major;

DROP TABLE planned_minor;

DROP TABLE prereq;

DROP TABLE user;

-- End of file.

