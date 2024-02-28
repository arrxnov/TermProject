-- Created by Vertabelo (http://vertabelo.com)
-- Last modification date: 2024-02-28 20:36:38.347

-- tables
-- Table: catalog
CREATE TABLE catalog (
    year numeric(4,0)  NOT NULL,
    CONSTRAINT catalog_pk PRIMARY KEY (year)
);

-- Table: catalog_courses
CREATE TABLE catalog_courses (
    catalog_year numeric(4,0)  NOT NULL,
    course_id varchar(9)  NOT NULL,
    CONSTRAINT catalog_courses_pk PRIMARY KEY (course_id,catalog_year)
);

-- Table: concentration
CREATE TABLE concentration (
    id int  NOT NULL AUTO_INCREMENT,
    name varchar(32)  NOT NULL,
    major_id int  NOT NULL,
    CONSTRAINT concentration_pk PRIMARY KEY (id)
);

-- Table: concentration_course
CREATE TABLE concentration_course (
    concentration_id int  NOT NULL,
    course_id varchar(9)  NOT NULL,
    type varchar(9)  NOT NULL CHECK (type in ('core', 'elective')),
    CONSTRAINT concentration_course_pk PRIMARY KEY (course_id,concentration_id)
);

-- Table: course
CREATE TABLE course (
    id varchar(9)  NOT NULL,
    name varchar(32)  NOT NULL,
    credits numeric(3,1)  NOT NULL,
    description varchar(512)  NOT NULL,
    CONSTRAINT course_pk PRIMARY KEY (id)
);

-- Table: gened
CREATE TABLE gened (
    catalog_year numeric(4,0)  NOT NULL,
    course_id varchar(9)  NOT NULL,
    type varchar(9)  NOT NULL CHECK (type in ('core', 'elective')),
    CONSTRAINT gened_pk PRIMARY KEY (course_id,catalog_year)
);

-- Table: major
CREATE TABLE major (
    id int  NOT NULL AUTO_INCREMENT,
    name varchar(32)  NOT NULL,
    catalog_year numeric(4,0)  NOT NULL,
    CONSTRAINT major_pk PRIMARY KEY (id)
);

-- Table: major_course
CREATE TABLE major_course (
    major_id int  NOT NULL,
    course_id varchar(9)  NOT NULL,
    type varchar(9)  NOT NULL CHECK (type in ('core', 'elective')),
    CONSTRAINT major_course_pk PRIMARY KEY (course_id,major_id)
);

-- Table: minor
CREATE TABLE minor (
    id int  NOT NULL AUTO_INCREMENT,
    name varchar(32)  NOT NULL,
    catalog_year numeric(4,0)  NOT NULL,
    CONSTRAINT minor_pk PRIMARY KEY (id)
);

-- Table: minor_course
CREATE TABLE minor_course (
    minor_id int  NOT NULL,
    course_id varchar(9)  NOT NULL,
    type varchar(9)  NOT NULL CHECK (type in ('core', 'elective')),
    CONSTRAINT minor_course_pk PRIMARY KEY (course_id,minor_id)
);

-- Table: plan
CREATE TABLE plan (
    id int  NOT NULL AUTO_INCREMENT,
    name varchar(32)  NOT NULL,
    catalog_year numeric(4,0)  NOT NULL,
    user_id int  NOT NULL,
    current_year numeric(4,0)  NOT NULL,
    current_term varchar(6)  NOT NULL CHECK (curr_semester in ('Fall', 'Spring', 'Summer')),
    CONSTRAINT plan_pk PRIMARY KEY (id)
);

-- Table: planned_courses
CREATE TABLE planned_courses (
    plan_id int  NOT NULL,
    course_id varchar(9)  NOT NULL,
    year numeric(4,0)  NOT NULL,
    term varchar(6)  NOT NULL CHECK (semester in ('Fall', 'Spring', 'Summer')),
    CONSTRAINT planned_courses_pk PRIMARY KEY (plan_id,course_id,year,term)
);

-- Table: prereqs
CREATE TABLE prereqs (
    course_id varchar(9)  NOT NULL,
    prereq_id varchar(9)  NOT NULL,
    CONSTRAINT prereqs_pk PRIMARY KEY (course_id,prereq_id)
);

-- Table: user
CREATE TABLE user (
    id int  NOT NULL AUTO_INCREMENT,
    username varchar(32)  NOT NULL,
    phash char(60)  NOT NULL,
    name varchar(32)  NOT NULL,
    gpa numeric(3,2)  NOT NULL,
    major_gpa numeric(3,2)  NOT NULL,
    CONSTRAINT user_pk PRIMARY KEY (id)
);

-- foreign keys
-- Reference: catalog_catalog (table: catalog_courses)
ALTER TABLE catalog_courses ADD CONSTRAINT catalog_catalog FOREIGN KEY catalog_catalog (catalog_year)
    REFERENCES catalog (year);

-- Reference: catalog_course (table: catalog_courses)
ALTER TABLE catalog_courses ADD CONSTRAINT catalog_course FOREIGN KEY catalog_course (course_id)
    REFERENCES course (id);

-- Reference: concentration_course_concentration (table: concentration_course)
ALTER TABLE concentration_course ADD CONSTRAINT concentration_course_concentration FOREIGN KEY concentration_course_concentration (concentration_id)
    REFERENCES concentration (id);

-- Reference: concentration_courses_course (table: concentration_course)
ALTER TABLE concentration_course ADD CONSTRAINT concentration_courses_course FOREIGN KEY concentration_courses_course (course_id)
    REFERENCES course (id);

-- Reference: concentrations_majors (table: concentration)
ALTER TABLE concentration ADD CONSTRAINT concentrations_majors FOREIGN KEY concentrations_majors (major_id)
    REFERENCES major (id);

-- Reference: gened_catalog (table: gened)
ALTER TABLE gened ADD CONSTRAINT gened_catalog FOREIGN KEY gened_catalog (catalog_year)
    REFERENCES catalog (year);

-- Reference: gened_course (table: gened)
ALTER TABLE gened ADD CONSTRAINT gened_course FOREIGN KEY gened_course (course_id)
    REFERENCES course (id);

-- Reference: major_catalog (table: major)
ALTER TABLE major ADD CONSTRAINT major_catalog FOREIGN KEY major_catalog (catalog_year)
    REFERENCES catalog (year);

-- Reference: major_course (table: major_course)
ALTER TABLE major_course ADD CONSTRAINT major_course FOREIGN KEY major_course (course_id)
    REFERENCES course (id);

-- Reference: major_courses (table: major_course)
ALTER TABLE major_course ADD CONSTRAINT major_courses FOREIGN KEY major_courses (major_id)
    REFERENCES major (id);

-- Reference: minor_catalog (table: minor)
ALTER TABLE minor ADD CONSTRAINT minor_catalog FOREIGN KEY minor_catalog (catalog_year)
    REFERENCES catalog (year);

-- Reference: minor_courses (table: minor_course)
ALTER TABLE minor_course ADD CONSTRAINT minor_courses FOREIGN KEY minor_courses (minor_id)
    REFERENCES minor (id);

-- Reference: minor_courses_course (table: minor_course)
ALTER TABLE minor_course ADD CONSTRAINT minor_courses_course FOREIGN KEY minor_courses_course (course_id)
    REFERENCES course (id);

-- Reference: plan_user (table: plan)
ALTER TABLE plan ADD CONSTRAINT plan_user FOREIGN KEY plan_user (user_id)
    REFERENCES user (id);

-- Reference: planned_courses_course (table: planned_courses)
ALTER TABLE planned_courses ADD CONSTRAINT planned_courses_course FOREIGN KEY planned_courses_course (course_id)
    REFERENCES course (id);

-- Reference: planned_courses_plan (table: planned_courses)
ALTER TABLE planned_courses ADD CONSTRAINT planned_courses_plan FOREIGN KEY planned_courses_plan (plan_id)
    REFERENCES plan (id);

-- Reference: prereqs_course1 (table: prereqs)
ALTER TABLE prereqs ADD CONSTRAINT prereqs_course1 FOREIGN KEY prereqs_course1 (course_id)
    REFERENCES course (id);

-- Reference: prereqs_course2 (table: prereqs)
ALTER TABLE prereqs ADD CONSTRAINT prereqs_course2 FOREIGN KEY prereqs_course2 (prereq_id)
    REFERENCES course (id);

-- End of file.

