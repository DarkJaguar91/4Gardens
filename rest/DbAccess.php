<?php
    /**
     * Created by PhpStorm.
     * User: bjtal
     * Date: 2016/03/20
     * Time: 9:18 PM
     */

class DBAccess {
    var $serverName = "localhost";
    var $username = "angeli4_4gardens";
    var $password = "4G4Rd3Ns";
    var $dbName = "angeli4_4gardens";

    var $conn;

    function __construct()
    {
        $this->conn = mysqli_connect($this->serverName, $this->username, $this->password, $this->dbName);
        if (!$this->conn)
            die('Connection failed: ' . mysqli_connect_error());
    }

    function get($SQL) {
        $result = $this->conn->query($SQL);

        $output = array();
        while ($row = $result->fetch_assoc()) {
            $output[] = $row;
        }

        return $output;
    }

    function insert($SQL)
    {
        if ($this->conn->query($SQL) == TRUE) {
            return $this->conn->insert_id;
        } else {
            return -1;
        }
    }

    function __destruct()
    {
        $this->conn->close();
    }

    public function update($SQL)
    {
        if ($this->conn->query($SQL) === TRUE) {
            return TRUE;
        }
        return $this->conn->error;
    }
}