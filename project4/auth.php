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
      echo "<script>";
      echo "   window.location.replace('./login.php');";
      echo "</script>";
   }
   else {
      session_start();
      $_SESSION["name"] = $user;
      echo "<script>";
      echo "   window.location.replace('./index.php');";
      echo "</script>";
   }
?>