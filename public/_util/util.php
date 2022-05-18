<?php

include "db.php";

function verifyUser($user, $voter) {
  isIdExist('users', $user || $user == 'NULL') || response(500, "User not found");
  isIdExist('voters', $voter || $voter == 'NULL') || response(500, "Voter not found");
  handleQuery("UPDATE users SET voter=$voter WHERE id =$user");
}

function unVerify($user) {
  isIdExist('users', $user) || response(500, "User not found");
  handleQuery("UPDATE users SET voter=NULL WHERE id = '$user'");
}

function changeVoter($user, $voter) {
  (isIdExist('users', $user) || $user == "NULL") || response(500, "User not found");
  (isIdExist('voters', $voter ) || $user == "NULL") || response(500, "Voter not found");
  handleQuery("UPDATE users SET voter=$voter WHERE id = $user");
}

function createRequest($user, $data) {
  $res = isIdExist('users', $user);
  $res || response(500, "User not found");

  $sql = "SELECT * FROM requests WHERE owner = '$user'";
  $res = handleQuery($sql);
  $res->num_rows > 0 && response(500, "You already have a request");

  $type = $data['type'];
  unset($data['type']);

  $data = json_encode($data, JSON_UNESCAPED_UNICODE);
  
  $sql = "INSERT INTO requests (owner, data, type) VALUES ('$user', '$data', '$type')";
  handleQuery($sql);
}

function acceptRequest($request) {
  $res = isIdExist('requests', $request);
  $res || response(500, "Request not found");
  $row = mysqli_fetch_assoc($res);

  $type = $row['type'];
  $data = $row['data'] ?? null;
  $user = $row['owner'];

  if ($type == "deleteUser") {
    handleQuery("DELETE FROM users WHERE id = '$user'");
    handleQuery("DELETE FROM requests WHERE id = '$request'");
  }
  if ($type == "changeData") {
    updateUser($user, $data);
    handleQuery("DELETE FROM requests WHERE id = '$request'");
  }
}


function rejectRequest(array $request) {
  $request = join(',', $request);
  handleQuery("DELETE FROM requests WHERE id = '$request'");
}

function changePassword($user, $password) {
  isIdExist('users', $user) || response(500, "User not found");
  $password = password_hash($password, PASSWORD_DEFAULT);
  handleQuery("UPDATE users SET password = '$password' WHERE id = '$user'");
}

function verifyInfo(array $data, $type = "user"): bool {
  if ($type == "user") {
    $firstName    = $data['firstName']     ?? null;
    $middleName   = $data['middleName']    ?? "";
    $lastName     = $data['lastName']      ?? null;
    $address1     = $data['address1']      ?? null;
    $address2     = $data['address2']      ?? null;
    $province     = $data['province']      ?? null;
    $region       = $data['region']        ?? null;
    $bday         = $data['bday']          ?? null;
    $phone        = $data['phone']         ?? null;
    $city         = $data['city']          ?? null;
  
    if (!(
      $firstName && 
      $lastName  && 
      $province  &&
      $region    &&
      $address1  &&
      $address2  &&
      $city      
    )) response(500, 'Missing required fields.');
  
    if (strlen($firstName)  > 50 ) response(500, 'First name must be less than 50 characters.'  [1]);
    if (strlen($middleName) > 50 ) response(500, 'Middle name must be less than 50 characters.' [2]);
    if (strlen($lastName)   > 50 ) response(500, 'Last name must be less than 50 characters.',  [3]);
    if (strlen($region)     > 50 ) response(500, 'Region must be less than 50 characters.',     [4]);
    if (strlen($province)   > 50 ) response(500, 'Province must be less than 50 characters.',   [5]);
    if (strlen($city)       > 50 ) response(500, 'City must be less than 50 characters.',       [6]);
    if (strlen($address1)   > 100) response(500, 'Address 1 must be less than 100 characters.', [7]);
    if (strlen($address2)   > 100) response(500, 'Barangay must be less than 100 characters.',  [8]);
    if (strlen($phone)      != 10) response(500, 'Phone must be exactly 10 characters.',        [9]);
    if (!preg_match('/^[0-9]{10}$/', $phone))  response(500, 'Invalid phone number.',           [9]);
    if ((time() - intval($bday)) > 3784320000) response(500, 'Please check your birthday and try again',                       [12]);
    if ((time() - intval($bday)) < 536112000)  response(500, 'You must be at least 18 years old or older to use our service.', [12]);

    return true;
  }

  if ($type == "voter") {
    $name     = $data['name']     ?? null;
    $address  = $data['address']  ?? null;
    $precinct = $data['precinct'] ?? null;
    $state    = $data['state']    ?? "";
    $status   = intval($data['status']);
    $number   = $data['number'] ?? $data['no'] ?? null;
  
    if (!($name && $address && $precinct && $number)) response(500, 'Missing required fields.');
    if (strlen($name)     > 100)  response(500, 'Name must be less than 100 characters.');
    if (strlen($address)  > 150)  response(500, 'Address must be less than 100 characters.');
    if (strlen($precinct) > 50)   response(500, 'Precinct must be less than 50 characters.');
    if (intval($number)   > 1000) response(500, 'Number must be less than 1000.');
    if (intval($number)   < 1)    response(500, 'Number must be greater than 0.');
    if (strlen($state)    > 10)   response(500, 'State must be less than 10 characters.');
    if ($status < 0 || $status > 1) response(500, 'Status must be 0 or 1.');

    return true;
  }

  return false;
}

function deleteUser(array $user) {
  array_walk($user, fn($u) => isIdExist('users', $u) || response(500, "User not found"));
  $user = implode(", ", $user);
  handleQuery("DELETE FROM users WHERE id in ($user)");
}

function updateUser($user, $data) {
  isIdExist('users', $user) || response(500, "User not found");
  $data = $data['phone'] ? $data : json_decode($data, true);

  $phone        = $data['phone']           ?? null;
  $firstName    = $values['firstName']     ?? null;
  $middleName   = $values['middleName']    ?? "";
  $lastName     = $values['lastName']      ?? null;
  $address1     = $values['address1']      ?? null;
  $address2     = $values['address2']      ?? null;
  $province     = $values['province']      ?? null;
  $region       = $values['region']        ?? null;
  $phone        = $values['phone']         ?? null;
  $city         = $values['city']          ?? null;
  $bday         = $values['bday']          ?? ($values['birthday'] ?? null);
  
  $phone ?? response(500, 'Missing required fields.');
  verifyInfo ($data);

  $phoneLen = strlen($phone);
  $phoneLen == 9  && $phone = '+639' . $phone;
  $phoneLen == 10 && $phone = '+63'  . $phone;
  
  $sql = "UPDATE users SET 
            phone = '$phone', 
            firstName = '$firstName', 
            middleName = '$middleName', 
            lastName = '$lastName', 
            address1 = '$address1', 
            address2 = '$address2', 
            province = '$province', 
            region = '$region', 
            bday = '$bday', 
            city = '$city' 
          WHERE id = '$user'";

  return !!handleQuery($sql);

}

function editVoter($id, $data) {
  $name     = $data['name']     ?? null;
  $address  = $data['address']  ?? null;
  $precinct = $data['precinct'] ?? null;
  $number   = $data['number'] ?? $data['no'] ?? null;
  $state    = $data['state']    ?? "";
  $status   = intval($data['status']);

  verifyInfo($data, "voter");
  handleQuery("UPDATE voters SET 
            name    = '$name', 
            address = '$address', 
            prec_id = '$precinct', 
            no      = '$number', 
            state   = '$state', 
            status  = '$status'
           WHERE id = '$id'");
}

function createVoter($data) {
  global $conn;
  $name     = $data['name']     ?? null;
  $address  = $data['address']  ?? null;
  $precinct = $data['precinct'] ?? null;
  $number   = $data['number'] ?? $data['no'] ?? null;
  $state    = $data['state']    ?? "";
  $status   = intval($data['status']);

  
  verifyInfo($data, "voter");
  handleQuery("INSERT INTO voters (name, address, prec_id, no, state, status) VALUES ('$name', '$address', '$precinct', '$number', '$state', '$status')");

  return $conn->insert_id;
}

function deleteVoter($id) {
  isIdExist('voters', $id) || response(500, "Voter not found");
  handleQuery("DELETE FROM voters WHERE id = '$id'");
}

function createWhere($search, $prefix = "users") {
  return "(firstName  LIKE '%$search%' 
        OR lastName   LIKE '%$search%' 
        OR middleName LIKE '%$search%' 
        OR address1   LIKE '%$search%' 
        OR address2   LIKE '%$search%' 
        OR city       LIKE '%$search%' 
        OR province   LIKE '%$search%' 
        OR region     LIKE '%$search%' 
        OR phone      LIKE '%$search%' 
        OR email      LIKE '%$search%') AND $prefix.id !=" . $_SESSION['s-user'];
}

function getUsers($data) {
  $users = Array();
  $sort = $data['sort'] ?? 'id';
  $dir  = $data['dir']  ?? 'ASC';
  $page = $data['page'] ?? 1;
  $search = $data['search'] ?? null;

  $sql = "SELECT * FROM users WHERE voter IS NOT NULL AND ".createWhere($search)." ORDER BY $sort $dir LIMIT " . ($page - 1) * 10 . ", 10";
  $res = handleQuery($sql);

  while ($row = $res->fetch_assoc()) {
    $voter = $row['voter'] ?? null;

    if ($voter) {
      $sql = "SELECT * FROM voters WHERE id = '$voter'";
      $voter = handleQuery($sql)->fetch_assoc();
      $row['voter'] = $voter;
    }
    $users[] = $row;
  }

  return $users;
}

function getUnverifiedUsers($data) {
  $sort = $data['sort'] ?? 'id';
  $dir  = $data['dir']  ?? 'ASC';
  $page = $data['page'] ?? 1;
  $search = $data['search'] ?? null;

  $sql = "SELECT * FROM users WHERE voter IS NULL AND ".createWhere($search)." ORDER BY $sort $dir LIMIT " . ($page - 1) * 10 . ", 10";
  return handleQuery($sql)->fetch_all(MYSQLI_ASSOC);
}

function getRequests($query) {
  $sort = $query['sort'] ?? 'r_id';
  $dir  = $query['dir']  ?? 'ASC';
  $page = $query['page'] ?? 1;
  $search = $query['search'] ?? null;

  $sql = "SELECT *, u.id as u_id, r.id as r_id FROM requests as r JOIN users as u ON r.owner = u.id WHERE ".createWhere($search, "u")." ORDER BY $sort $dir LIMIT " . ($page - 1) * 10 . ", 10";
  return handleQuery($sql)->fetch_all(MYSQLI_ASSOC);
}

function getVoters($query) {
  $sort = $query['sort'] ?? 'id';
  $dir  = $query['dir']  ?? 'ASC';
  $page = $query['page'] ?? 1;
  $search = $query['search'] ?? null;

  $sql = "SELECT * FROM voters WHERE name LIKE '%$search%' OR address LIKE '%$search%' ORDER BY $sort $dir LIMIT " . ($page - 1) * 10 . ", 10";
  return handleQuery($sql)->fetch_all(MYSQLI_ASSOC);
}

function getUnverifiedUsersPages($data) {
  $search = $data['search'] ?? "";
  $sql = "SELECT COUNT(*) FROM users WHERE voter IS NULL AND ".createWhere($search);
  $res = handleQuery($sql);
  $row = $res->fetch_row();
  return [$row[0], ceil($row[0] / 10)];
}

function getUsersPages($data) {
  $search = $data['search'] ?? "";
  $sql = "SELECT COUNT(*) FROM users WHERE ".createWhere($search)." AND voter IS NOT NULL";
  $res = handleQuery($sql);
  $row = $res->fetch_row();
  return [$row[0], ceil($row[0] / 10)];
}

function getVotersPages($data) {
  $search = $data['search'] ?? "";
  $sql = "SELECT COUNT(*) FROM voters WHERE name LIKE '%$search%'";
  $res = handleQuery($sql);
  $row = $res->fetch_row();
  return [$row[0], ceil($row[0] / 10)];
}

function getRequestsPages($data) {
  $search = $data['search'] ?? "";
  $sql = "SELECT COUNT(*) FROM requests JOIN users ON requests.owner = users.id WHERE ".createWhere($search);
  $res = handleQuery($sql);
  $row = $res->fetch_row();
  return [$row[0], ceil($row[0] / 10)];
}
