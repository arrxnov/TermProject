<?php

error_reporting(E_ALL);
ini_set('display_errors', 'On');
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

    $sql = "SELECT default_plan_id FROM zeus_user WHERE username = ?";
    $plan_id = sqlQuery($link, $sql, "default_plan_id", $username);
    
    // $sql = "SELECT catalog_year FROM zeus_plan WHERE id = ?";
    // $myObj->catalog = sqlQuery($link, $sql, "catalog_year", $plan_id);

    $sql = "SELECT major_id FROM zeus_planned_major WHERE plan_id = ?";
    $major_id = sqlQuery($link, $sql, "major_id", $plan_id);
    
    $sql = "SELECT name FROM zeus_plan WHERE id = ?";
    $myObj->plan->name = sqlQuery($link, $sql, "name", $plan_id);

    $sql = "SELECT name FROM zeus_major WHERE id = ?";
    $myObj->plan->major = sqlQuery($link, $sql, "name", $major_id);
    
    $myObj->plan->minor = "Bible";
    
    $sql = "SELECT catalog_year FROM zeus_plan WHERE id = ?";
    $myObj->year = sqlQuery($link, $sql, "catalog_year", $plan_id);

    $sql = "SELECT gpa FROM zeus_user WHERE username = ?";
    $myObj->gpa = sqlQuery($link, $sql, "gpa", $username);
    
    $sql = "SELECT major_gpa FROM zeus_user WHERE username = ?";
    $myObj->major_gpa = sqlQuery($link, $sql, "major_gpa", $username);
    
    $sql = "SELECT name FROM zeus_user WHERE username = ?";
    $myObj->plan->student = sqlQuery($link, $sql, "name", $username);

    $myObj->plan->currYear = date('Y');
    
    $month = date('m');
    if ($month < 8 && $month > 5) {
        $cmyObj->plan->urrTerm = "Summer";
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
    $myObj->courses = array();
    foreach ($ids as $id) {
        $myObj->courses[$id] = new stdClass();
        
        $sql = "SELECT term FROM zeus_planned_course WHERE course_id = ?";
        $myObj->courses[$id]->term = sqlQuery($link, $sql, "term", $id);

        $sql = "SELECT year FROM zeus_planned_course WHERE course_id = ?";
        $myObj->courses[$id]->year = sqlQuery($link, $sql, "year", $id);

        $myObj->courses[$id]->course_des = $id;

        $sql = "SELECT name FROM zeus_course WHERE id = ?";
        $myObj->courses[$id]->course_name = sqlQuery($link, $sql, "name", $id);

        $sql = "SELECT credits FROM zeus_course WHERE id = ?";
        $myObj->courses[$id]->credits = sqlQuery($link, $sql, "credits", $id);
    }

    // $sql = "SELECT pc.term, pc.year, c.description as course_des, c.name as course_name, c.credits FROM zeus_planned_course as pc LEFT JOIN zeus_course as c ON pc.course_id = c.course_id WHERE pc.plan_id = ?";
    // $sql = "SELECT * FROM zeus_planned_course LEFT JOIN zeus_course ON zeus_planned_course.course_id = zeus_course.course_id WHERE zeus_planned_course.plan_id = ?";
    // $statement = $link->prepare($sql);
    // $statement->execute([$plan_id]);
    // $result = $statement->fetch();
    // var_dump($myObj->courses = $result[0]);
    // // $myObj->courses = sqlQuery($link, $sql, "stuff", $plan_id); // might need to be changed to get everything since sqlQuery gets index 0
    // // function sqlQuery($link, $sql, $column, $constraint) {
    // //     $statement = $link->prepare($sql);
    // //     $statement->execute([$constraint]);
    // //     $result = $statement->fetch();
    // //     return $result[$column];
    // // }
    echo json_encode($myObj);

}

?>