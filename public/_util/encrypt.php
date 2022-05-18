<?php


// Do not change unless you know what you are doing
// changing this may lead to users unable to login
  $encrypt_method = "AES-256-CBC";
  $secret_key = "o%q23/da\{EW)kah#@92^43_";
  $secret_iv = "{-e23^@65^3|/*23#32";

  function encrypt_decrypt($action, $string) {
    global $encrypt_method, $secret_key, $secret_iv;

    $output = false;

    $encrypt_method = "AES-256-CBC";
    $secret_key = 'This is my secret key';
    $secret_iv = 'This is my secret iv';

    $key = hash('sha256', $secret_key);
    $iv = substr(hash('sha256', $secret_iv), 0, 16);

    if($action == 'encrypt') {
        $output = openssl_encrypt($string, $encrypt_method, $key, 0, $iv);
        $output = base64_encode($output);
    }
    else if($action == 'decrypt'){
        $output = openssl_decrypt(base64_decode($string), $encrypt_method, $key, 0, $iv);
    }

    return $output;
  }
