<?php
   session_start();
   if (!isset($_SESSION["name"])) {
      header('Location: http://judah.cedarville.edu/~grady/TermProject/project4/login.php');
   }
   
   $index = fopen("./index.html", "r");
   while (!feof($index)) {
      $line = fgets($index);
      echo $line;
   }
?>