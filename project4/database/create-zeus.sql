-- Creation Order: user, catalog, major, minor, concentration, course, catalog_course, prereq, gened, major_course, minor_course, concentration_course, plan, planned_major, planned_minor, planned_concentration, planned_course
-- Destruction Order needs to be opposite
DROP TABLE IF EXISTS zeus_planned_course;
DROP TABLE IF EXISTS zeus_planned_concentration;
DROP TABLE IF EXISTS zeus_planned_minor;
DROP TABLE IF EXISTS zeus_planned_major;
DROP TABLE IF EXISTS zeus_plan;
DROP TABLE IF EXISTS zeus_concentration_course;
DROP TABLE IF EXISTS zeus_minor_course;
DROP TABLE IF EXISTS zeus_major_course;
DROP TABLE IF EXISTS zeus_gened;
DROP TABLE IF EXISTS zeus_prereq;
DROP TABLE IF EXISTS zeus_catalog_course;
DROP TABLE IF EXISTS zeus_course;
DROP TABLE IF EXISTS zeus_concentration;
DROP TABLE IF EXISTS zeus_minor;
DROP TABLE IF EXISTS zeus_major;
DROP TABLE IF EXISTS zeus_catalog;
DROP TABLE IF EXISTS zeus_user;

CREATE TABLE zeus_user (
    id int  NOT NULL AUTO_INCREMENT,
    username varchar(32)  NOT NULL,
    phash char(60)  NOT NULL,
    name varchar(64)  NOT NULL,
    gpa numeric(3,2)  NOT NULL,
    major_gpa numeric(3,2)  NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE zeus_catalog (
    year numeric(4,0)  NOT NULL,
    PRIMARY KEY (year)
);

CREATE TABLE zeus_major (
    id int  NOT NULL AUTO_INCREMENT,
    name varchar(32)  NOT NULL,
    catalog_year numeric(4,0)  NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (catalog_year) REFERENCES zeus_catalog (year)
);

CREATE TABLE zeus_minor (
    id int  NOT NULL AUTO_INCREMENT,
    name varchar(32)  NOT NULL,
    catalog_year numeric(4,0)  NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (catalog_year) REFERENCES zeus_catalog (year)
);

CREATE TABLE zeus_concentration (
    id int  NOT NULL AUTO_INCREMENT,
    name varchar(32)  NOT NULL,
    major_id int  NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (major_id) REFERENCES zeus_major (id)
);

CREATE TABLE zeus_course (
    id varchar(9)  NOT NULL,
    name varchar(32)  NOT NULL,
    credits numeric(3,1)  NOT NULL,
    description varchar(512)  NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE zeus_catalog_course (
    catalog_year numeric(4,0)  NOT NULL,
    course_id varchar(9)  NOT NULL,
    PRIMARY KEY (course_id,catalog_year),
    FOREIGN KEY (catalog_year) REFERENCES zeus_catalog (year),
    FOREIGN KEY (course_id) REFERENCES zeus_course (id)
);

CREATE TABLE zeus_prereq (
    course_id varchar(9)  NOT NULL,
    prereq_id varchar(9)  NOT NULL,
    PRIMARY KEY (course_id,prereq_id),
    FOREIGN KEY (course_id) REFERENCES zeus_course (id),
    FOREIGN KEY (prereq_id) REFERENCES zeus_course (id)
);

CREATE TABLE zeus_gened (
    catalog_year numeric(4,0)  NOT NULL,
    course_id varchar(9)  NOT NULL,
    type varchar(9)  NOT NULL CHECK (type in ('core', 'elective')),
    PRIMARY KEY (course_id,catalog_year),
    FOREIGN KEY (catalog_year) REFERENCES zeus_catalog (year),
    FOREIGN KEY (course_id) REFERENCES zeus_course (id)
);

CREATE TABLE zeus_major_course (
    major_id int  NOT NULL,
    course_id varchar(9)  NOT NULL,
    type varchar(9)  NOT NULL CHECK (type in ('core', 'elective')),
    PRIMARY KEY (course_id,major_id),
    FOREIGN KEY (course_id) REFERENCES zeus_course (id),
    FOREIGN KEY (major_id) REFERENCES zeus_major (id)
);

CREATE TABLE zeus_minor_course (
    minor_id int  NOT NULL,
    course_id varchar(9)  NOT NULL,
    type varchar(9)  NOT NULL CHECK (type in ('core', 'elective')),
    PRIMARY KEY (course_id,minor_id),
    FOREIGN KEY (minor_id) REFERENCES zeus_minor (id),
    FOREIGN KEY (course_id) REFERENCES zeus_course (id)
);

CREATE TABLE zeus_concentration_course (
    concentration_id int  NOT NULL,
    course_id varchar(9)  NOT NULL,
    type varchar(9)  NOT NULL CHECK (type in ('core', 'elective')),
    PRIMARY KEY (course_id,concentration_id),
    FOREIGN KEY (concentration_id) REFERENCES zeus_concentration (id),
    FOREIGN KEY (course_id) REFERENCES zeus_course (id)
);

CREATE TABLE zeus_plan (
    id int  NOT NULL AUTO_INCREMENT,
    name varchar(32)  NOT NULL,
    user_id int  NOT NULL,
    catalog_year numeric(4,0)  NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES zeus_user (id),
    FOREIGN KEY (catalog_year) REFERENCES zeus_catalog (year)
);

CREATE TABLE zeus_planned_major (
    major_id int  NOT NULL,
    plan_id int  NOT NULL,
    PRIMARY KEY (major_id,plan_id),
    FOREIGN KEY (major_id) REFERENCES zeus_major (id),
    FOREIGN KEY (plan_id) REFERENCES zeus_plan (id)
);

CREATE TABLE zeus_planned_minor (
    minor_id int  NOT NULL,
    plan_id int  NOT NULL,
    PRIMARY KEY (minor_id,plan_id),
    FOREIGN KEY (minor_id) REFERENCES zeus_minor (id),
    FOREIGN KEY (plan_id) REFERENCES zeus_plan (id)
);

CREATE TABLE zeus_planned_concentration (
    concentration_id int  NOT NULL,
    plan_id int  NOT NULL,
    PRIMARY KEY (concentration_id,plan_id),
    FOREIGN KEY (concentration_id) REFERENCES zeus_concentration (id),
    FOREIGN KEY (plan_id) REFERENCES zeus_plan (id)
);

CREATE TABLE zeus_planned_course (
    plan_id int  NOT NULL,
    course_id varchar(9)  NOT NULL,
    year numeric(4,0)  NOT NULL,
    term varchar(6)  NOT NULL CHECK (term in ('Fall', 'Spring', 'Summer')),
    PRIMARY KEY (plan_id,course_id,year,term),
    FOREIGN KEY (course_id) REFERENCES zeus_course (id),
    FOREIGN KEY (plan_id) REFERENCES zeus_plan (id)
);

-- End of table creation

INSERT INTO zeus_user
    (username, phash, name, gpa, major_gpa)
VALUES
    ('loganmiller216','000000000000000000000000000000000000000000000000000000000000','Logan Miller', '3.55','3.60'),
    ('jgrady','000000000000000000000000000000000000000000000000000000000000','Jacob Grady', '3.75','3.50'),
    ('kaidendelsing','000000000000000000000000000000000000000000000000000000000000','Kai Delsing', '3.50','3.65');

INSERT INTO zeus_catalog
    (year)
VALUES
    (2021),
    (2022),
    (2023);

INSERT INTO zeus_major
    (name, catalog_year)
VALUES
    ('Computer Science', 2021),
    ('Cyber Operations', 2021),
    ('Computer Engineering', 2021),
    ('Math', 2021),
    ('Bible', 2021);

INSERT INTO zeus_minor
    (name, catalog_year)
VALUES
    ('Computer Science', 2021),
    ('Cyber Operations', 2021),
    ('Computer Engineering', 2021),
    ('Math', 2021),
    ('Bible', 2021),
    ('Creative Writing', 2021);

INSERT INTO zeus_concentration
    (name, major_id)
VALUES
    ('Cyber Operations', 1),
    ('Graphic Design', 1),
    ('Hardware', 1),
    ('Video Game Engineering', 1);

-- Populate with Python script
INSERT INTO zeus_course
    (name, credits, description)
VALUES
    ('','','',),
    ('','','',),
    ('','','',);

-- Populate with Python script from plan json
INSERT INTO zeus_catalog_course
    (catalog_year, course_id)
VALUES
    ('','','',),
    ('','','',),
    ('','','',);

-- Leave empty
-- INSERT INTO zeus_prereq
--     (course_id, prereq_id)
-- VALUES
--     ('','','',),
--     ('','','',),
--     ('','','',);

-- Populate with Python script from requirements json
INSERT INTO zeus_gened
    (catalog_year, course_id, type)
VALUES
    ('','','',),
    ('','','',),
    ('','','',);

-- Populate with Python script from requirements json
INSERT INTO zeus_major_course
    (major_id, course_id, type)
VALUES
    ('','','',),
    ('','','',),
    ('','','',);

-- Populate with Python script from requirements json
INSERT INTO zeus_minor_course
    (minor_id, course_id, type)
VALUES
    ('','','',),
    ('','','',),
    ('','','',);

-- Populate with Python script from requirements json
INSERT INTO zeus_concentration_course
    (concentration_id, course_id, type)
VALUES
    ('','','',),
    ('','','',),
    ('','','',);

INSERT INTO zeus_plan
    (name, user_id, catalog_year)
VALUES
    ('CS-CY Double Major',1,2021),
    ('Too Late to Change Majors',1,2023)
    ('My Cyber Ops Plan',2,2021),
    ('Default Plan',3,2021);

INSERT INTO zeus_planned_major
    (major_id, plan_id)
VALUES
    ('','','',),
    ('','','',),
    ('','','',);

INSERT INTO zeus_planned_minor
    (minor_id, plan_id)
VALUES
    ('','','',),
    ('','','',),
    ('','','',);

INSERT INTO zeus_planned_concentration
    (concentration_id, plan_id)
VALUES
    ('','','',),
    ('','','',),
    ('','','',);

-- Populate with Python script from plan json
INSERT INTO zeus_planned_course
    (plan_id, course_id, year, term)
VALUES
    ('','','',),
    ('','','',),
    ('','','',);

-- https://ape.cedarville.edu/reply.php?action=getPlan&plan=14259
-- https://ape.cedarville.edu/reply.php?action=getSessionPlan