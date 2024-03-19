<?php

error_reporting(E_ALL);
ini_set('display_errors', 'On');
session_start();

session_destroy();
unset($_SESSION);
header("Location: http://judah.cedarville.edu/~grady/TermProject/project4/login.php");
?>