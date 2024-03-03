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

DROP TABLE IF EXISTS zeus_plan;
CREATE TABLE zeus_plan (
    id int  NOT NULL AUTO_INCREMENT,
    name varchar(32)  NOT NULL,
    catalog_year numeric(4,0)  NOT NULL,
    user_id int  NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES zeus_user (id)
);

DROP TABLE IF EXISTS zeus_catalog;
CREATE TABLE zeus_catalog (
    year numeric(4,0)  NOT NULL,
    CONSTRAINT zeus_catalog_pk PRIMARY KEY (year)
);

DROP TABLE IF EXISTS zeus_course;
CREATE TABLE zeus_course (
    id varchar(9)  NOT NULL,
    name varchar(32)  NOT NULL,
    credits numeric(3,1)  NOT NULL,
    description varchar(512)  NOT NULL,
    PRIMARY KEY (id)
);

DROP TABLE IF EXISTS zeus_planned_course;
CREATE TABLE zeus_planned_course (
    plan_id int  NOT NULL,
    course_id varchar(9)  NOT NULL,
    year numeric(4,0)  NOT NULL,
    term varchar(6)  NOT NULL CHECK (term in ('Fall', 'Spring', 'Summer')),
    PRIMARY KEY (plan_id,course_id,year,term),
    FOREIGN KEY (course_id) REFERENCES zeus_course (id),
    FOREIGN KEY (plan_id) REFERENCES zeus_plan (id)
);

DROP TABLE IF EXISTS zeus_prereq;
CREATE TABLE zeus_prereq (
    course_id varchar(9)  NOT NULL,
    prereq_id varchar(9)  NOT NULL,
    PRIMARY KEY (course_id,prereq_id),
    FOREIGN KEY (course_id) REFERENCES zeus_course (id),
    FOREIGN KEY (prereq_id) REFERENCES zeus_course (id)
);

DROP TABLE IF EXISTS zeus_catalog_course;
CREATE TABLE zeus_catalog_course (
    catalog_year numeric(4,0)  NOT NULL,
    course_id varchar(9)  NOT NULL,
    PRIMARY KEY (course_id,catalog_year),
    FOREIGN KEY (catalog_year) REFERENCES zeus_catalog (year),
    FOREIGN KEY (course_id) REFERENCES zeus_course (id)
);

DROP TABLE IF EXISTS zeus_gened;
CREATE TABLE zeus_gened (
    catalog_year numeric(4,0)  NOT NULL,
    course_id varchar(9)  NOT NULL,
    type varchar(9)  NOT NULL CHECK (type in ('core', 'elective')),
    PRIMARY KEY (course_id,catalog_year),
    FOREIGN KEY (catalog_year) REFERENCES zeus_catalog (year),
    FOREIGN KEY (course_id) REFERENCES zeus_course (id)
);

DROP TABLE IF EXISTS zeus_major;
CREATE TABLE zeus_major (
    id int  NOT NULL AUTO_INCREMENT,
    name varchar(32)  NOT NULL,
    catalog_year numeric(4,0)  NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (catalog_year) REFERENCES zeus_catalog (year)
);

DROP TABLE IF EXISTS zeus_major_course;
CREATE TABLE zeus_major_course (
    major_id int  NOT NULL,
    course_id varchar(9)  NOT NULL,
    type varchar(9)  NOT NULL CHECK (type in ('core', 'elective')),
    PRIMARY KEY (course_id,major_id),
    FOREIGN KEY (course_id) REFERENCES zeus_course (id),
    FOREIGN KEY (major_id) REFERENCES zeus_major (id)
);

DROP TABLE IF EXISTS zeus_planned_major;
CREATE TABLE zeus_planned_major (
    major_id int  NOT NULL,
    plan_id int  NOT NULL,
    PRIMARY KEY (major_id,plan_id),
    FOREIGN KEY (major_id) REFERENCES zeus_major (id),
    FOREIGN KEY (plan_id) REFERENCES zeus_plan (id)
);

DROP TABLE IF EXISTS zeus_minor;
CREATE TABLE zeus_minor (
    id int  NOT NULL AUTO_INCREMENT,
    name varchar(32)  NOT NULL,
    catalog_year numeric(4,0)  NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (catalog_year) REFERENCES zeus_catalog (year)
);

DROP TABLE IF EXISTS zeus_minor_course;
CREATE TABLE zeus_minor_course (
    minor_id int  NOT NULL,
    course_id varchar(9)  NOT NULL,
    type varchar(9)  NOT NULL CHECK (type in ('core', 'elective')),
    PRIMARY KEY (course_id,minor_id),
    FOREIGN KEY (minor_id) REFERENCES zeus_minor (id),
    FOREIGN KEY (course_id) REFERENCES zeus_course (id)
);

DROP TABLE IF EXISTS zeus_planned_minor;
CREATE TABLE zeus_planned_minor (
    minor_id int  NOT NULL,
    plan_id int  NOT NULL,
    PRIMARY KEY (minor_id,plan_id),
    FOREIGN KEY (minor_id) REFERENCES zeus_minor (id),
    FOREIGN KEY (plan_id) REFERENCES zeus_plan (id)
);

DROP TABLE IF EXISTS zeus_concentration;
CREATE TABLE zeus_concentration (
    id int  NOT NULL AUTO_INCREMENT,
    name varchar(32)  NOT NULL,
    major_id int  NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (major_id) REFERENCES zeus_major (id)
);

DROP TABLE IF EXISTS zeus_concentration_course;
CREATE TABLE zeus_concentration_course (
    concentration_id int  NOT NULL,
    course_id varchar(9)  NOT NULL,
    type varchar(9)  NOT NULL CHECK (type in ('core', 'elective')),
    PRIMARY KEY (course_id,concentration_id),
    FOREIGN KEY (concentration_id) REFERENCES zeus_concentration (id),
    FOREIGN KEY (course_id) REFERENCES zeus_course (id)
);

DROP TABLE IF EXISTS zeus_planned_concentration;
CREATE TABLE zeus_planned_concentration (
    concentration_id int  NOT NULL,
    plan_id int  NOT NULL,
    PRIMARY KEY (concentration_id,plan_id),
    FOREIGN KEY (concentration_id) REFERENCES zeus_concentration (id),
    FOREIGN KEY (plan_id) REFERENCES zeus_plan (id)
);

-- End of file

