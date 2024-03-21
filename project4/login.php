<?php
    $index = fopen("./login.html", "r");
    while (!feof($index)) {
        $line = fgets($index);
        echo $line;
     }

?>