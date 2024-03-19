<?php
   $user =  $_REQUEST["user"];
   $hash =  hash("sha256", $_REQUEST["pass"]);
   $dsn = "mysql:host=james.cedarville.edu;dbname=cs3220_sp24";
   $username = "cs3220_sp24";
   $password = "OqagokbAg9DzKZGb";
   $link = new PDO($dsn, $username, $password);
   $sql = "SELECT phash FROM zeus_user WHERE username = ?";
   $statement = $link->prepare($sql);
   $statement->execute([$user]);
   $result = $statement->fetch();
   if ($result[0] != $hash) {
      header('Location: http://judah.cedarville.edu/~grady/TermProject/project4/login.php');
   }
   else {
      session_start();
      $_SESSION["name"] = $user;
      header('Location: http://judah.cedarville.edu/~grady/TermProject/project4/index.php');
   }
?>