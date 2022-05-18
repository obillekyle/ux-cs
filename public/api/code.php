<?php


session_start();
include_once '../_util/db.php';
include_once '../_util/response.php';


if (isset($_GET['ec'])) {
  $email = $_GET['ec'];
  $code = rand(100000, 999999);

  filter_var($mail, FILTER_VALIDATE_EMAIL) || response(500, 'Invalid email.');
  
  if (isset($_SESSION['s-code'])) {
    $time = time() - $_SESSION['s-code']['time'];
    $time < 60 && response(500, 'You cannot request a new code for another ' . (60 - $time). ' seconds.');
  }
  
  include_once '../_util/mail.php';
  $html = file_get_contents("../_util/send-code-template.html");
  $html = str_replace("%b", "Email Verification",str_replace('%c', $code, $html));
  $mail = mailTo($email, 'Email Verification', $html);

  if ($mail) {
    $_SESSION['s-code'] = array(
      'code' => $code,
      'time' => time(),
      'type' => 'email'
    );
    response(200, 'Code sent.');
  }
  response(500, 'Error sending code.');
}

if (isset($_GET['ev'])) {
  $code = $_GET['ev'];
  if (isset($_SESSION['s-code']) && $_SESSION['s-code']['code'] == $code) {
    $_SESSION['s-code']['type'] != 'email' && response(500, 'Code is not for email verification.');
    unset($_SESSION['code']);
    response(200, 'Code verified.');
  }
  response(500, 'Code is not valid.');
}

if (isset($_GET['pc'])) {
  $mail = $_GET['pc'];
  $code = rand(100000, 999999);

  filter_var($mail, FILTER_VALIDATE_EMAIL) || response(500, 'Invalid email.');
  
  if (isset($_SESSION['s-code'])) {
    $time = time() - $_SESSION['s-code']['time'];
    $time < 60 && response(500, 'You cannot request a new code for another ' . (60 - $time). ' seconds.');
  }
  
  $sql = "SELECT * FROM `users` WHERE `email` = '$mail'";
  handleQuery($sql)->fetch_assoc() || response(200, 'Invalid email or password.');

  include_once '../_util/mail.php';
  $html = file_get_contents("../_util/send-code-template.html");
  $html = str_replace("%b", "Resetting Password",str_replace('%c', $code, $html));
  $mail = mailTo($email, 'Resetting Password', $html);

  if ($mail) {
    $_SESSION['s-code'] = array(
      'code' => $code,
      'time' => time(),
      'type' => 'password'
    );
    response(200, 'Code sent.');
  }
  response(500, 'Error sending code.');
}

if (isset($_GET['pv'])) {
  $code = $_GET['pv'];
  if (isset($_SESSION['s-code']) && $_SESSION['s-code']['code'] == $code) {
    $_SESSION['s-code']['type'] != 'password' && response(500, 'Code is not for password reset.');
    unset($_SESSION['code']);
    response(200, 'Code verified.');
  }
  response(500, 'Code is not valid.');
}