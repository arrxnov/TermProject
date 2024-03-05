-- Created by Vertabelo (http://vertabelo.com)
-- Last modification date: 2024-03-05 22:44:21.883

-- tables
-- Table: zeus_catalog
CREATE TABLE zeus_catalog (
    year numeric(4,0)  NOT NULL,
    CONSTRAINT zeus_catalog_pk PRIMARY KEY (year)
);

-- Table: zeus_catalog_course
CREATE TABLE zeus_catalog_course (
    catalog_year numeric(4,0)  NOT NULL,
    course_id varchar(9)  NOT NULL,
    CONSTRAINT zeus_catalog_course_pk PRIMARY KEY (course_id,catalog_year)
);

-- Table: zeus_concentration
CREATE TABLE zeus_concentration (
    id int  NOT NULL AUTO_INCREMENT,
    name varchar(32)  NOT NULL,
    major_id int  NOT NULL,
    CONSTRAINT zeus_concentration_pk PRIMARY KEY (id)
);

-- Table: zeus_concentration_course
CREATE TABLE zeus_concentration_course (
    concentration_id int  NOT NULL,
    course_id varchar(9)  NOT NULL,
    type varchar(9)  NOT NULL CHECK (type in ('core', 'elective')),
    CONSTRAINT zeus_concentration_course_pk PRIMARY KEY (course_id,concentration_id)
);

-- Table: zeus_course
CREATE TABLE zeus_course (
    id varchar(9)  NOT NULL,
    name varchar(32)  NOT NULL,
    credits numeric(3,1)  NOT NULL,
    description varchar(512)  NOT NULL,
    CONSTRAINT zeus_course_pk PRIMARY KEY (id)
);

-- Table: zeus_gened
CREATE TABLE zeus_gened (
    catalog_year numeric(4,0)  NOT NULL,
    course_id varchar(9)  NOT NULL,
    type varchar(9)  NOT NULL CHECK (type in ('core', 'elective')),
    CONSTRAINT zeus_gened_pk PRIMARY KEY (course_id,catalog_year)
);

-- Table: zeus_major
CREATE TABLE zeus_major (
    id int  NOT NULL AUTO_INCREMENT,
    name varchar(32)  NOT NULL,
    catalog_year numeric(4,0)  NOT NULL,
    CONSTRAINT zeus_major_pk PRIMARY KEY (id)
);

-- Table: zeus_major_course
CREATE TABLE zeus_major_course (
    major_id int  NOT NULL,
    course_id varchar(9)  NOT NULL,
    type varchar(9)  NOT NULL CHECK (type in ('core', 'elective')),
    CONSTRAINT zeus_major_course_pk PRIMARY KEY (course_id,major_id)
);

-- Table: zeus_minor
CREATE TABLE zeus_minor (
    id int  NOT NULL AUTO_INCREMENT,
    name varchar(32)  NOT NULL,
    catalog_year numeric(4,0)  NOT NULL,
    CONSTRAINT zeus_minor_pk PRIMARY KEY (id)
);

-- Table: zeus_minor_course
CREATE TABLE zeus_minor_course (
    minor_id int  NOT NULL,
    course_id varchar(9)  NOT NULL,
    type varchar(9)  NOT NULL CHECK (type in ('core', 'elective')),
    CONSTRAINT zeus_minor_course_pk PRIMARY KEY (course_id,minor_id)
);

-- Table: zeus_plan
CREATE TABLE zeus_plan (
    id int  NOT NULL AUTO_INCREMENT,
    name varchar(32)  NOT NULL,
    user_id int  NOT NULL,
    catalog_year numeric(4,0)  NOT NULL,
    CONSTRAINT zeus_plan_pk PRIMARY KEY (id)
);

-- Table: zeus_planned_concentration
CREATE TABLE zeus_planned_concentration (
    concentration_id int  NOT NULL,
    plan_id int  NOT NULL,
    CONSTRAINT zeus_planned_concentration_pk PRIMARY KEY (concentration_id,plan_id)
);

-- Table: zeus_planned_course
CREATE TABLE zeus_planned_course (
    plan_id int  NOT NULL,
    course_id varchar(9)  NOT NULL,
    year numeric(4,0)  NOT NULL,
    term varchar(6)  NOT NULL CHECK (term in ('Fall', 'Spring', 'Summer')),
    CONSTRAINT zeus_planned_course_pk PRIMARY KEY (plan_id,course_id,year,term)
);

-- Table: zeus_planned_major
CREATE TABLE zeus_planned_major (
    major_id int  NOT NULL,
    plan_id int  NOT NULL,
    CONSTRAINT zeus_planned_major_pk PRIMARY KEY (major_id,plan_id)
);

-- Table: zeus_planned_minor
CREATE TABLE zeus_planned_minor (
    minor_id int  NOT NULL,
    plan_id int  NOT NULL,
    CONSTRAINT zeus_planned_minor_pk PRIMARY KEY (minor_id,plan_id)
);

-- Table: zeus_prereq
CREATE TABLE zeus_prereq (
    course_id varchar(9)  NOT NULL,
    prereq_id varchar(9)  NOT NULL,
    CONSTRAINT zeus_prereq_pk PRIMARY KEY (course_id,prereq_id)
);

-- Table: zeus_user
CREATE TABLE zeus_user (
    id int  NOT NULL AUTO_INCREMENT,
    username varchar(32)  NOT NULL,
    phash char(60)  NOT NULL,
    name varchar(64)  NOT NULL,
    gpa numeric(3,2)  NOT NULL,
    major_gpa numeric(3,2)  NOT NULL,
    CONSTRAINT zeus_user_pk PRIMARY KEY (id)
);

-- foreign keys
-- Reference: catalog_catalog (table: zeus_catalog_course)
ALTER TABLE zeus_catalog_course ADD CONSTRAINT catalog_catalog FOREIGN KEY catalog_catalog (catalog_year)
    REFERENCES zeus_catalog (year);

-- Reference: catalog_course (table: zeus_catalog_course)
ALTER TABLE zeus_catalog_course ADD CONSTRAINT catalog_course FOREIGN KEY catalog_course (course_id)
    REFERENCES zeus_course (id);

-- Reference: concentration_course_concentration (table: zeus_concentration_course)
ALTER TABLE zeus_concentration_course ADD CONSTRAINT concentration_course_concentration FOREIGN KEY concentration_course_concentration (concentration_id)
    REFERENCES zeus_concentration (id);

-- Reference: concentration_courses_course (table: zeus_concentration_course)
ALTER TABLE zeus_concentration_course ADD CONSTRAINT concentration_courses_course FOREIGN KEY concentration_courses_course (course_id)
    REFERENCES zeus_course (id);

-- Reference: concentrations_majors (table: zeus_concentration)
ALTER TABLE zeus_concentration ADD CONSTRAINT concentrations_majors FOREIGN KEY concentrations_majors (major_id)
    REFERENCES zeus_major (id);

-- Reference: gened_catalog (table: zeus_gened)
ALTER TABLE zeus_gened ADD CONSTRAINT gened_catalog FOREIGN KEY gened_catalog (catalog_year)
    REFERENCES zeus_catalog (year);

-- Reference: gened_course (table: zeus_gened)
ALTER TABLE zeus_gened ADD CONSTRAINT gened_course FOREIGN KEY gened_course (course_id)
    REFERENCES zeus_course (id);

-- Reference: major_catalog (table: zeus_major)
ALTER TABLE zeus_major ADD CONSTRAINT major_catalog FOREIGN KEY major_catalog (catalog_year)
    REFERENCES zeus_catalog (year);

-- Reference: major_course (table: zeus_major_course)
ALTER TABLE zeus_major_course ADD CONSTRAINT major_course FOREIGN KEY major_course (course_id)
    REFERENCES zeus_course (id);

-- Reference: major_courses (table: zeus_major_course)
ALTER TABLE zeus_major_course ADD CONSTRAINT major_courses FOREIGN KEY major_courses (major_id)
    REFERENCES zeus_major (id);

-- Reference: minor_catalog (table: zeus_minor)
ALTER TABLE zeus_minor ADD CONSTRAINT minor_catalog FOREIGN KEY minor_catalog (catalog_year)
    REFERENCES zeus_catalog (year);

-- Reference: minor_courses (table: zeus_minor_course)
ALTER TABLE zeus_minor_course ADD CONSTRAINT minor_courses FOREIGN KEY minor_courses (minor_id)
    REFERENCES zeus_minor (id);

-- Reference: minor_courses_course (table: zeus_minor_course)
ALTER TABLE zeus_minor_course ADD CONSTRAINT minor_courses_course FOREIGN KEY minor_courses_course (course_id)
    REFERENCES zeus_course (id);

-- Reference: plan_user (table: zeus_plan)
ALTER TABLE zeus_plan ADD CONSTRAINT plan_user FOREIGN KEY plan_user (user_id)
    REFERENCES zeus_user (id);

-- Reference: planned_concentration_concentration (table: zeus_planned_concentration)
ALTER TABLE zeus_planned_concentration ADD CONSTRAINT planned_concentration_concentration FOREIGN KEY planned_concentration_concentration (concentration_id)
    REFERENCES zeus_concentration (id);

-- Reference: planned_concentration_plan (table: zeus_planned_concentration)
ALTER TABLE zeus_planned_concentration ADD CONSTRAINT planned_concentration_plan FOREIGN KEY planned_concentration_plan (plan_id)
    REFERENCES zeus_plan (id);

-- Reference: planned_courses_course (table: zeus_planned_course)
ALTER TABLE zeus_planned_course ADD CONSTRAINT planned_courses_course FOREIGN KEY planned_courses_course (course_id)
    REFERENCES zeus_course (id);

-- Reference: planned_courses_plan (table: zeus_planned_course)
ALTER TABLE zeus_planned_course ADD CONSTRAINT planned_courses_plan FOREIGN KEY planned_courses_plan (plan_id)
    REFERENCES zeus_plan (id);

-- Reference: planned_major_major (table: zeus_planned_major)
ALTER TABLE zeus_planned_major ADD CONSTRAINT planned_major_major FOREIGN KEY planned_major_major (major_id)
    REFERENCES zeus_major (id);

-- Reference: planned_major_plan (table: zeus_planned_major)
ALTER TABLE zeus_planned_major ADD CONSTRAINT planned_major_plan FOREIGN KEY planned_major_plan (plan_id)
    REFERENCES zeus_plan (id);

-- Reference: planned_minor_minor (table: zeus_planned_minor)
ALTER TABLE zeus_planned_minor ADD CONSTRAINT planned_minor_minor FOREIGN KEY planned_minor_minor (minor_id)
    REFERENCES zeus_minor (id);

-- Reference: planned_minor_plan (table: zeus_planned_minor)
ALTER TABLE zeus_planned_minor ADD CONSTRAINT planned_minor_plan FOREIGN KEY planned_minor_plan (plan_id)
    REFERENCES zeus_plan (id);

-- Reference: prereqs_course1 (table: zeus_prereq)
ALTER TABLE zeus_prereq ADD CONSTRAINT prereqs_course1 FOREIGN KEY prereqs_course1 (course_id)
    REFERENCES zeus_course (id);

-- Reference: prereqs_course2 (table: zeus_prereq)
ALTER TABLE zeus_prereq ADD CONSTRAINT prereqs_course2 FOREIGN KEY prereqs_course2 (prereq_id)
    REFERENCES zeus_course (id);

-- Reference: zeus_plan_zeus_catalog (table: zeus_plan)
ALTER TABLE zeus_plan ADD CONSTRAINT zeus_plan_zeus_catalog FOREIGN KEY zeus_plan_zeus_catalog (catalog_year)
    REFERENCES zeus_catalog (year);

-- End of file.

