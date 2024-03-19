<?php
session_destroy();
unset($_SESSION);
header("Location: http://judah.cedarville.edu/~grady/TermProject/project4/login.php");
?>