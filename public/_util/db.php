<?php

$dbhost = "localhost";
$dbuser = "root";
$dbpass = "";
$dbname = "voters";

include "response.php";

session_start([
  'cookie_lifetime' => 86400,
  'gc_maxlifetime' => 86400,
]);
ini_set('display_errors', 1);
error_reporting(E_ALL);

$conn = mysqli_connect($dbhost, $dbuser, $dbpass, $dbname);

if (!$conn) {
  die("Connection failed: " . mysqli_connect_error());
}

$sql = "SET NAMES 'utf8'";
$res = mysqli_query($conn, $sql);

function handleQuery(string $sql, ?bool $handleError = true) {

  global $conn;

  $res = mysqli_query($conn, $sql);
  if ($res == false && $handleError) {
    $error = mysqli_error($conn);
    response(500, $error);
  }

  return $res;
}

function isIdExist(string $table, int $data): \mysqli_result | false {
  $data = intval($data ?? '0');
  $sql = "SELECT * FROM $table WHERE id = '$data'";
  $res = handleQuery($sql);
  return mysqli_num_rows($res) > 0 ? $res : false;
}