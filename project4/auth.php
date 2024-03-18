<?php
   echo "<html>";
   echo $_REQUEST["user"];
   echo "<br>";
   echo $_REQUEST["pass"];
   echo "<br>"; 
   echo hash("sha256", $_REQUEST["pass"]);
   echo "<br>";
   echo "</html>";
?>