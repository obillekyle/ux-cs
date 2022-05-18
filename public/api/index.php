<?php

  include "../_util/util.php";

  if ($_SERVER['REQUEST_METHOD'] == "POST") {
    $req = json_decode(file_get_contents("php://input") ?? "[]", true) ?? [];

    if (isset($req['createRequest'])) {
      $data = $req['createRequest'];
      $user = $_SESSION['s-user'] ?? null;
      createRequest($user, $data);
    }
  }
  if ($_SERVER['REQUEST_METHOD'] == "PATCH") {
    $req = json_decode(file_get_contents("php://input") ?? "[]", true) ?? [];
    
    if (isset($req['changePassword'])) {
      $data = $req['changePassword'];
      $conf = $data['confirm'] ?? null;
      $new  = $data['new']  ?? null;
      $user = $_SESSION['s-user'] ?? null;

      $sql = "SELECT * FROM users WHERE id =$user";
      $data = handleQuery($sql)->fetch_assoc();

      password_verify($conf, $data['password']) || response(403, "Password incorrect");  

      changePassword($user, $new);
    }
  }

  if ($_SERVER['REQUEST_METHOD'] == "DELETE") {
    $req = json_decode(file_get_contents("php://input") ?? "[]", true) ?? [];

    if (isset($req['deleteRequest'])) {
      $user = $_SESSION['s-user'] ?? null;
      $sql = "DELETE FROM requests WHERE owner = $user";
      handleQuery($sql);
    }
  }

  response(200, "Done");