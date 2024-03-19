<?php

session_start();


function sqlQuery($link, $sql, $constraint) {
    $statement = $link->prepare($sql);
    $statement->execute([$constraint]);
    $result = $statement->fetch();
    return $result;
}

if (!isset($_SESSION["name"])) {
    header("Location: ./login.php");
}
else {
    $username = $_SESSION["name"];
    
    $link = new mysqli("localhost", "cs3220_sp24", "OqagokbAg9DzKZGb", "cs3220_sp24");    
    
    if (!isset($_REQUEST["plan-name"])) {
        $sql = "SELECT default_plan_id FROM zeus_user WHERE username = ?";
        $myObj->plan_name = sqlQuery($link, $sql, $username);
    } else {
        $sql = "SELECT name FROM zeus_plan WHERE name = ?";
        $statement = $link->prepare($sql);
        $statement->execute([$_REQUEST["plan-name"]]);
        $myObj->plan_name = $statement->fetch();
    }
    
    $sql = "SELECT catalog_year FROM zeus_plan WHERE name = ?";
    $myObj->catalog_year = sqlQuery($link, $sql, $myObj->plan_name);
    
    $sql = "SELECT id FROM zeus_plan WHERE name = ?";
    $id = sqlQuery($link, $sql, $myObj->plan_name);
    
    $sql = "SELECT major_id FROM zeus_planned_major WHERE plan_id = ?";
    $major_id = sqlQuery($link, $sql, $id);

    $sql = "SELECT name FROM zeus_major WHERE major_id = ?";
    $major_name = sqlQuery($link, $sql, $major_id);
    
    $myObj->minor = "Bible";
    
    $sql = "SELECT catalog_year FROM zeus_plan WHERE id = ?";
    $myObj->year = sqlQuery($link, $sql, $id);

    $sql = "SELECT gpa FROM zeus_user WHERE username = ?";
    $myObj->gpa = sqlQuery($link, $sql, $username);
    
    $sql = "SELECT major_gpa FROM zeus_user WHERE username = ?";
    $myObj->major_gpa = sqlQuery($link, $sql, $username);
    
    $sql = "SELECT name FROM zeus_user WHERE username = ?";
    $myObj->student_name = sqlQuery($link, $sql, $username);

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
    
    $myObj->courses = "SELECT term, year, course_des, course_name, credits FROM zeus_planned_course WHERE plan_id = ?";
    
    
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