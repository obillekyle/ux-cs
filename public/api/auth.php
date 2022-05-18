<?php

include_once '../_util/util.php';
$method = $_SERVER['REQUEST_METHOD'];

error_reporting(E_ALL);
ini_set('display_errors', 1);
$user = $_SESSION['s-user'] ?? null;

if ($method == 'POST') {

  throttled();

  $post = json_decode(file_get_contents('php://input'), true);

  if (isset($post['create'])) {

    $user && response(403, 'Already logged in');
    $values       = $post['create'];
    $firstName    = $values['firstName']     ?? null;
    $middleName   = $values['middleName']    ?? "";
    $lastName     = $values['lastName']      ?? null;
    $address1     = $values['address1']      ?? null;
    $address2     = $values['address2']      ?? null;
    $province     = $values['province']      ?? null;
    $region       = $values['region']        ?? null;
    $bday         = $values['bday']          ?? null;
    $phone        = $values['phone']         ?? null;
    $city         = $values['city']          ?? null;
    $phone        = $values['phone']         ?? null;
    $email        = $values['email']         ?? null;
    $password     = $values['password']      ?? null;
    $emailConsent = $values['emailConsent']  ?? null ? "1" : "0";
    
    !($phone && $email && $password) && response(500, 'Missing required fields.');
    strlen($password) < 8            && response(500, 'Password must be at least 8 characters.', [10]);
    strlen($email)    > 100          && response(500, 'Email must be less than 100 characters.', [11]);
    !filter_var($email, 274)         && response(500, 'Invalid email.',                          [11]);
    
    verifyInfo($values);
    $phoneLen = strlen($phone);
    $phoneLen == 9  && $phone = '+639' . $phone;
    $phoneLen == 10 && $phone = '+63'  . $phone;

    $sql = "SELECT * FROM `users` WHERE `email` = '$email' OR `phone` = '$phone'";
    handleQuery($sql)->num_rows > 0 && response(500, 'Email or Phone already exists.');

    $password = password_hash($password, PASSWORD_DEFAULT);

    $sql = "INSERT INTO `users` (
                  `firstName`, 
                  `middleName`, 
                  `lastName`, 
                  `password`, 
                  `address1`, 
                  `address2`, 
                  `province`, 
                  `city`, 
                  `email`, 
                  `region`, 
                  `phone`, 
                  `emailConsent`,
                  `birthday`
                ) VALUES (
                  '$firstName', 
                  '$middleName', 
                  '$lastName', 
                  '$password', 
                  '$address1', 
                  '$address2', 
                  '$province', 
                  '$city', 
                  '$email', 
                  '$region', 
                  '$phone', 
                  $emailConsent,
                  '$bday'
                )";
    $res = handleQuery($sql);
    $uid = $conn->insert_id;

    $_SESSION['s-user'] = $uid;
    response(200, 'User created.', getSession());
  }

  if (isset($post['login'])) {
    $user && response(403, 'Already logged in');

    $values = $post['login'];
    $email = $values['email'] ?? null;
    $password = $values['password'] ?? null;

    if (!($email && $password)) response(500, 'Missing required fields.');

    $sql  = "SELECT * FROM `users` WHERE `email` = '$email' OR `phone` = '$email'";
    $user = handleQuery($sql)->fetch_assoc();
    $user == null && response(500, 'Invalid email or password.');

    if (password_verify($password, $user['password'])) {
      $_SESSION['s-user'] = $user['id'];
      response(200, 'Logged in.', getSession());
    }
    response(500, 'Invalid email or password.');
  }
  if (isset($post['cp'])) {
    $data = $post['cp'];
    $user && response(403, 'Already logged in');
    $newP = base64_decode($data['n'] ?? "") ?? null;
    $mail = base64_decode($data['o'] ?? "") ?? null;

    ($newP && $mail) || response(500, 'Missing required fields.');

    $sql = "SELECT * FROM `users` WHERE `email` = '$mail'";
    $user = handleQuery($sql)->fetch_assoc();
    $user || response(500, 'Invalid email or password.');

    $newP = password_hash($newP, PASSWORD_DEFAULT);
    $sql = "UPDATE `users` SET `password` = '$newP' WHERE `email` = '$mail'";
    handleQuery($sql);
    response(200, 'Password changed.');
  }
}

if ($_GET['logout'] ?? null) {
  session_destroy();
  response(200, 'Logged out.');
}


throttled(3, 2);
response(200, 'Fetched session', getSession());


function getSession() {
  $user = $_SESSION['s-user'] ?? response(403, 'Not logged in');
  $sql  = "SELECT role, firstName, lastName, middleName FROM `users` WHERE id='$user'";
  $res  = handleQuery($sql);
  $res -> num_rows == 0 && response(500, 'Not logged in.');
  $row  = $res -> fetch_assoc();

  $lName = strlen($row['lastName']) > 0 ? $row['lastName'] . ', ' : "";
  $mName = strlen($row['middleName']) > 0 ? " " . implode("", array_map(fn($v) => $v[0], explode(" ", $row['middleName']))). "." : "";
  $role = $row['role'];
  $name = $lName . $row['firstName'] . $mName;

  $_SESSION['s-role'] = $role;

  $data = array(
    'name' => $name,
    'user' => $user,
    'role' => $role,
  );

  return $data;
}

function throttled(?int $requestLimit = 5, ?int $timeLimit = 5) {
  $lastTime = time() - ($_SESSION['s-last_request_time'] ?? (time() - $timeLimit));
  $requestCount = $_SESSION['s-request_count'] ?? 0;

  if ($lastTime < $timeLimit) {
    if ($requestCount > $requestLimit) {
      response(500, 'Too many requests.');
      return true;
    }
    $_SESSION['s-request_count'] = ++$requestCount;
    return false;
  }
  $_SESSION['s-request_count'] = 0;
  $_SESSION['s-last_request_time'] = time();
  return false;
}
