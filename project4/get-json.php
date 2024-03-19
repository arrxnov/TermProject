<?php
session_start();
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
    $myObj->plan = new stdClass();

    if (!isset($_REQUEST["planId"])) {
        $sql = "SELECT default_plan_id FROM zeus_user WHERE username = ?";
        $plan_id = sqlQuery($link, $sql, "default_plan_id", $username);
    }
    else {
        $plan_id = $_REQUEST["planId"];
    }

    $sql = "SELECT major_id FROM zeus_planned_major WHERE plan_id = ?";
    $major_id = sqlQuery($link, $sql, "major_id", $plan_id);
    
    $sql = "SELECT name FROM zeus_plan WHERE id = ?";
    $myObj->plan->name = sqlQuery($link, $sql, "name", $plan_id);

    $sql = "SELECT name FROM zeus_major WHERE id = ?";
    $myObj->plan->major = sqlQuery($link, $sql, "name", $major_id);
    
    $myObj->plan->minor = "Bible";
    
    $sql = "SELECT catalog_year FROM zeus_plan WHERE id = ?";
    $myObj->plan->catYear = sqlQuery($link, $sql, "catalog_year", $plan_id);

    $sql = "SELECT gpa FROM zeus_user WHERE username = ?";
    $myObj->plan->gpa = sqlQuery($link, $sql, "gpa", $username);
    
    $sql = "SELECT major_gpa FROM zeus_user WHERE username = ?";
    $myObj->plan->major_gpa = sqlQuery($link, $sql, "major_gpa", $username);
    
    $sql = "SELECT name FROM zeus_user WHERE username = ?";
    $myObj->plan->student = sqlQuery($link, $sql, "name", $username);

    $myObj->plan->currYear = date('Y');
    
    $month = date('m');
    if ($month < 8 && $month > 5) {
        $cmyObj->plan->currTerm = "Summer";
    } else if ($month < 8) {
        $myObj->plan->currTerm = "Spring";
    } else {
        $myObj->plan->currTerm = "Fall";
    }
    
    $sql = "SELECT course_id FROM zeus_planned_course WHERE plan_id = ?";
    $statement = $link->prepare($sql);
    $statement->execute([$plan_id]);
    $result = $statement->fetchAll(PDO::FETCH_OBJ);
    $ids = array_map(function($v){
        return $v->course_id;
    }, $result);
    $myObj->plan->courses = array();
    foreach ($ids as $id) {
        $myObj->plan->courses[$id] = new stdClass();
        
        $sql = "SELECT term FROM zeus_planned_course WHERE course_id = ? AND plan_id = ?";
        $statement = $link->prepare($sql);
        $statement->execute(array($id, $plan_id));
        $term = $statement->fetch()["term"];
        if ($term === "FA") $myObj->plan->courses[$id]->term = "Fall";
        else if ($term === "SP") $myObj->plan->courses[$id]->term = "Spring";
        else if ($term === "SU") $myObj->plan->courses[$id]->term = "Summer";
        
        $sql = "SELECT year FROM zeus_planned_course WHERE course_id = ? AND plan_id = ?";
        $statement = $link->prepare($sql);
        $statement->execute(array($id, $plan_id));
        $myObj->plan->courses[$id]->year = $statement->fetch()["year"];

        $myObj->plan->courses[$id]->id = $id;
    }

    $sql = "SELECT * FROM zeus_course";
    $statement = $link->prepare($sql);
    $statement->execute();
    $result = $statement->fetchAll(PDO::FETCH_OBJ);
    $ids = array_map(function($v){
        return $v->id;
    }, $result);
    $myObj->catalog = new stdClass();
    $myObj->catalog->courses = array();
    foreach ($ids as $id) {
        $myObj->catalog->courses[$id] = new stdClass();
        
        $sql = "SELECT description FROM zeus_course WHERE id = ?";
        $myObj->catalog->courses[$id]->description = sqlQuery($link, $sql, "description", $id);

        $myObj->catalog->courses[$id]->id = $id;

        $sql = "SELECT name FROM zeus_course WHERE id = ?";
        $myObj->catalog->courses[$id]->name = sqlQuery($link, $sql, "name", $id);

        $sql = "SELECT credits FROM zeus_course WHERE id = ?";
        $myObj->catalog->courses[$id]->credits = sqlQuery($link, $sql, "credits", $id);
    }

    echo json_encode($myObj);

}

?>