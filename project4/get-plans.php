<?php

error_reporting(E_ALL);
ini_set('display_errors', 'On');
session_start();

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

    $sql = "SELECT id FROM zeus_user WHERE username = ?";
    $statement = $link->prepare($sql);
    $statement->execute([$username]);
    $user_id = $statement->fetch()["id"];

    $sql = "SELECT id FROM zeus_plan WHERE user_id = ?";
    $statement = $link->prepare($sql);
    $statement->execute([$user_id]);
    $result = $statement->fetchAll(PDO::FETCH_OBJ);
    $plans = array_map(function($x){
        return $x->id;
    }, $result);
    foreach ($plans as $plan) {
        $sql = "SELECT name FROM zeus_plan WHERE id = ?";
        $statement = $link->prepare($sql);
        $statement->execute([$plan]);
        $name = $statement->fetch()["name"];
        $myObj->$name = $plan;
    }
}

echo json_encode($myObj);

?>