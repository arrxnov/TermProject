<?php
   $user =  $_REQUEST["user"];
   $hash =  hash("sha256", $_REQUEST["pass"]);

   $link = new mysqli("localhost", "cs3220_sp24", "OqagokbAg9DzKZGb", "cs3220_sp24"); 

   $sql = "SELECT phash FROM zeus_user WHERE username = ?";
   $statement = $link->prepare($sql);
   $statement->execute([$user]);
   $result = $statement->fetch();
   echo $result;
   if ($result != $hash) {
      header('Location: ./login.php');
   }
   else {
      session_start();
      $_SESSION["name"] = $user;
      header('Location: ./index.php');
   }
?>