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
    header("Location: ./login.php");
}
else {
    $dsn = "mysql:host=james.cedarville.edu;dbname=cs3220_sp24";
    $sql_username = "cs3220_sp24";
    $password = "OqagokbAg9DzKZGb";
    $link = new PDO($dsn, $sql_username, $password);
    $username = $_SESSION["name"];
    
    $sql = "SELECT default_plan_id FROM zeus_user WHERE username = ?";
    $myObj = new stdClass();
    $plan_id = sqlQuery($link, $sql, "default_plan_id", $username);
    
    $sql = "SELECT catalog_year FROM zeus_plan WHERE id = ?";
    $myObj->catalog_year = new stdClass();
    $myObj->catalog_year = sqlQuery($link, $sql, "catalog_year", $plan_id);

    $sql = "SELECT major_id FROM zeus_planned_major WHERE plan_id = ?";
    $major_id = sqlQuery($link, $sql, "major_id", $plan_id);
    
    $sql = "SELECT name FROM zeus_plan WHERE id = ?";
    $myObj->plan_name = sqlQuery($link, $sql, "name", $plan_id);

    var_dump($plan_id);
    var_dump($myObj->plan_name);
    var_dump($myObj->catalog_year);
    var_dump($major_id);

    $sql = "SELECT name FROM zeus_plan WHERE id = ?";
    $myObj->planName = sqlQuery($link, $sql, "name", $plan_id);

    $sql = "SELECT name FROM zeus_major WHERE id = ?";
    $major_name = sqlQuery($link, $sql, "name", $major_id);
    
    $myObj->minor = "Bible";
    
    $sql = "SELECT catalog_year FROM zeus_plan WHERE id = ?";
    $myObj->year = sqlQuery($link, $sql, "year", $plan_id);

    $sql = "SELECT gpa FROM zeus_user WHERE username = ?";
    $myObj->gpa = sqlQuery($link, $sql, "gpa", $username);
    
    $sql = "SELECT major_gpa FROM zeus_user WHERE username = ?";
    $myObj->major_gpa = sqlQuery($link, $sql, "major_gpa", $username);
    
    $sql = "SELECT name FROM zeus_user WHERE username = ?";
    $myObj->student_name = sqlQuery($link, $sql, "name", $username);

    $currYear = date('Y');
    
    $month = date('m');
    if ($month < 8 && $month > 5) {
        $currTerm = "SU";
    } else if ($month < 8) {
        $currTerm = "SP";
    } else {
        $currTerm = "FA";
    }
    
    $myObj->current_semester = $currTerm.$currYear;
    
    $sql = "SELECT pc.term, pc.year, c.description as course_des, c.name as course_name, c.credits FROM zeus_planned_course as pc LEFT JOIN zeus_course as c ON pc.course_id = c.course_id";
    $myObj->courses = sqlQuery($link, $sql, "stuff", $plan_id); // might need to be changed to get everything since sqlQuery gets index 0
    // function sqlQuery($link, $sql, $column, $constraint) {
    //     $statement = $link->prepare($sql);
    //     $statement->execute([$constraint]);
    //     $result = $statement->fetch();
    //     return $result[$column];
    // }
    echo json_encode($myObj);


//     $myObj->name = "John";
//     $myObj->age = 30;
//     $myObj->city = "New York";
    
    
//     echo $myJSON;

//     $obj = json_decode($_GET["x"], false);

// $conn = new mysqli("myServer", "myUser", "myPassword", "Northwind");
// $stmt = $conn->prepare("SELECT name FROM customers LIMIT ?");
// $stmt->bind_param("s", $obj->limit);
// $stmt->execute();
// $result = $stmt->get_result();
// $outp = $result->fetch_all(MYSQLI_ASSOC);

// echo json_encode($outp);

    
}






?>