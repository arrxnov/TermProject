<?php
session_start();

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

function sqlQuery($link, $sql, $column, $constraint) {
    $statement = $link->prepare($sql);
    $statement->execute([$constraint]);
    $result = $statement->fetch();
    return $result[$column];
}

if (!isset($_SESSION["name"])) {
    header("Location: http://judah.cedarville.edu/~grady/TermProject/project4/login.php");
}
else {
    $dsn = "mysql:host=james.cedarville.edu;dbname=cs3220_sp24";
    $sql_username = "cs3220_sp24";
    $password = "OqagokbAg9DzKZGb";
    $link = new PDO($dsn, $sql_username, $password);
    $username = $_SESSION["name"];
    
    $myObj = new stdClass();
    $myObj->categories = new stdClass();
    
    $myObj->categories->Core = new StdClass();
    $myObj->categories->Electives = new StdClass();
    $myObj->categories->Cognates = new StdClass();
    $myObj->categories->GenEds = new StdClass();

    $myObj->categories->Core->courses = array();
    $myObj->categories->Electives->courses = array();
    $myObj->categories->Cognates->courses = array();
    $myObj->categories->GenEds->courses = array();

    if (!isset($_REQUEST["plan-name"])) {
        $sql = "SELECT default_plan_id FROM zeus_user WHERE username = ?";
        $plan_id = sqlQuery($link, $sql, "default_plan_id", $username);
    }
    else {
        $sql = "SELECT id FROM zeus_plan WHERE name = ? AND username = ?";
        $statement = $link->prepare($sql);
        $statement->execute(array($_REQUEST["plan-name"], $username));
        $plan_id = $statement->fetch("id");
    }

    $sql = "SELECT major_id FROM zeus_planned_major WHERE plan_id = ?";
    $major_id = sqlQuery($link, $sql, "major_id", $plan_id);

    $sql = "SELECT course_id from zeus_major_course WHERE major_id = ?";
    $statement = $link->prepare($sql);
    $statement->execute([$major_id]);
    $result = $statement->fetchAll(PDO::FETCH_OBJ);
    $ids = array_map(function($v){
        return $v->course_id;
    }, $result);
    foreach ($ids as $id) {
        $sql = "SELECT type FROM zeus_major_course WHERE course_id = ?";
        $type = sqlQuery($link, $sql, "type", $id);

        if ($type == "core") { 
            $myObj->categories->Core->courses[] = $id;
        }
        else if ($type == "elective") { 
            $myObj->categories->Electives->courses[] = $id;
        }
        else if ($type == "gened") { 
            $myObj->categories->GenEds->courses[] = $id;
        }
        else if ($type == "cognate") { 
            $myObj->categories->Cognates->courses[] = $id;
        }
    }

    $sql = "SELECT minor_id FROM zeus_planned_minor WHERE plan_id = ?";
    $minor_id = sqlQuery($link, $sql, "minor_id", $plan_id);

    $sql = "SELECT course_id FROM zeus_minor_course WHERE minor_id = ?";
    $statement = $link->prepare($sql);
    $statement->execute([$minor_id]);

    $result = $statement->fetchAll(PDO::FETCH_OBJ);
    $ids = array_map(function($v){
        return $v->course_id;
    }, $result);
    foreach ($ids as $id) {

        $sql = "SELECT type FROM zeus_minor_course WHERE course_id = ?";
        $type = sqlQuery($link, $sql, "type", $id);

        if ($type == "core") { 
            $myObj->categories->Core->courses[] = $id;
        }
        else if ($type == "elective") { 
            $myObj->categories->Electives->courses[] = $id;
        }
        else if ($type == "gened") { 
            $myObj->categories->GenEds->courses[] = $id;
        }
        else if ($type == "cognate") { 
            $myObj->categories->Cognates->courses[] = $id;
        }
    }

    $sql = "SELECT course_id FROM zeus_gened";
    $statement = $link->prepare($sql);
    $statement->execute();

    $result = $statement->fetchAll(PDO::FETCH_OBJ);
    $ids = array_map(function($v){
        return $v->course_id;
    }, $result);
    foreach ($ids as $id) {

        $sql = "SELECT type FROM zeus_gened WHERE course_id = ?";
        $type = sqlQuery($link, $sql, "type", $id);

        if ($type == "core") { 
            $myObj->categories->Core->courses[] = $id;
        }
        else if ($type == "elective") { 
            $myObj->categories->Electives->courses[] = $id;
        }
        else if ($type == "gened") { 
            $myObj->categories->GenEds->courses[] = $id;
        }
        else if ($type == "cognate") { 
            $myObj->categories->Cognates->courses[] = $id;
        }
    }
    echo json_encode($myObj);
}

?>