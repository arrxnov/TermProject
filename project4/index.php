<?php

    if (!isset($_SESSION["name"])) {
       redirectToLogin();
    }
    
    $index = fopen("./index.html", "r");
    while (!feof($index)) {
        $line = fgets($index);
        echo $line;
     }

     function redirectToLogin() {
        echo "<script>";
        echo "   window.location.replace('./login.php');";
        echo "</script>";
     }
?>