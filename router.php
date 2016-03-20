<?php
    /**
     * Created by PhpStorm.
     * User: bjtal
     * Date: 2016/03/20
     * Time: 11:18 AM
     */

    if (strrpos($_SERVER['REQUEST_URI'], "/4Gardens/rest", -strlen($_SERVER['REQUEST_URI']))) {
        
    }
    else
        echo $_SERVER['REQUEST_URI'];