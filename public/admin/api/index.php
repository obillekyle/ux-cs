<?php

include "../../_util/util.php";



if ($_SERVER['REQUEST_METHOD'] == "POST") {
  $req = json_decode(file_get_contents("php://input"), true) ?? [];

  if (isset($req['createVoter'])) {
    $data = $req['createVoter'];
    createVoter($data);
  }
}

if ($_SERVER['REQUEST_METHOD'] == "DELETE") {
  $req = json_decode(file_get_contents("php://input"), true) ?? [];

  if (isset($req['deleteUser'])) {
    $data = $req['deleteUser'];
    $user = $data['user'];
    deleteUser($user);
  }

  if (isset($req['deleteVoter'])) {
    $data = $req['deleteVoter'];
    $voter = $data['voter'] ?? null;
    deleteVoter( $voter);
  }

  if (isset($req['acceptRequest'])) {
    $data    = $req['acceptRequest'];
    $request = $data['req'] ?? null;
    acceptRequest($request);
  }

  if (isset($req['rejectRequest'])) {
    $data    = $req['rejectRequest'];
    $request = $data['req'] ?? null;
    rejectRequest($request);
  }
}

if ($_SERVER['REQUEST_METHOD'] == "PUT") {
  $req = json_decode(file_get_contents("php://input"), true) ?? [];

  if (isset($req['updateUser'])) {
    $data = $req['updateUser'];
    $user = $data['id'] ?? "";
    updateUser($user, $data);
  }

  if (isset($req['editVoter'])) {
    $data = $req['editVoter'];
    $voter = $data['id'] ?? null;
    editVoter($voter, $data);
  }
}


if ($_SERVER['REQUEST_METHOD'] == "PATCH") {
  $req = json_decode(file_get_contents("php://input"), true) ?? [];

  if (isset($req['verifyUser'])) { 
    $data  = $req['verifyUser'];
    $voter = $data['id'] ?? null;
    $user  = $data['user'] ?? null;
    verifyUser($user, $voter);
  }

  if (isset($req['unVerify'])) {
    $data = $req['unVerify'];
    $user = $data['user'] ?? null;
    unVerify($user, $voter);
  }

  if (isset($req['changeVoter'])) {
    $data = $req['changeVoter'];
    $user = $data['user'] ?? null;
    $voter = $data['voter'] ?? null;
    changeVoter($user, $voter);
  }
}

if ($_SERVER['REQUEST_METHOD'] == "GET") {

  $result = Array();
  $query = json_decode(base64_decode($_GET['q'] ?? ""), true);

  if (isset($query['users'])) {
    $data = $query['users'];
    $result['users'] = getUsers($data);
    $result['total']['users'] = getUsersPages($data);
  }

  if (isset($query['unv_users'])) {
    $data = $query['unv_users'];
    $result['unv_users'] = getUnverifiedUsers($data);
    $result['total']['unv_users'] = getUnverifiedUsersPages($data);
  }

  if (isset($query['voters'])) {
    $data = $query['voters'];
    $result['voters'] = getVoters($data);
    $result['total']['voters'] = getVotersPages($data);
  }

  if (isset($query['requests'])) {
    $data = $query['requests'];
    $result['requests'] = getRequests($data);
    $result['total']['requests'] = getRequestsPages($data);
  }

  response(200, "", $result);

}

response(200, "Success");