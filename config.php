<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "user_db";
//Създаване на връзка
$conn = new mysqli($servername, $username, $password, $dbname);
//Проверка на връзка
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>