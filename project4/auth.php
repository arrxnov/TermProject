<?php
   $user =  $_REQUEST["user"];
   $hash =  hash("sha256", $_REQUEST["pass"]);

   $link = new mysqli("localhost", "tron", "*jksi72$", "test"); 

   $sql = "SELECT password_hash WHERE stuid = ?";
   $statement = $link->prepare($sql);
   $statement->execute([$user]);

?>