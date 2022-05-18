<?php

include '../_util/db.php';

$user = $_SESSION['s-user'] ?? null;
$user == null && response(403, 'Not logged in');

$sql = "SELECT 
          `id`, 
          `firstName`, 
          `middleName`, 
          `lastName`, 
          `email`, 
          `address2`, 
          `address1`, 
          `city`, 
          `province`, 
          `region`, 
          `role`, 
          `firstLogin`, 
          `lastLogin`, 
          `birthday`, 
          `phone`, 
          `voter` 
        FROM `users` 
        WHERE id='$user'";
$data = handleQuery($sql)->fetch_assoc();
$data == null && response(500, 'Failed to fetch user data.');

if (isset($data['voter'])) {
  $voter = $data['voter'];
  $sql = "SELECT * FROM `voters` WHERE id='$voter'";

  $data['voter'] = handleQuery($sql)->fetch_assoc();
}

$sql = "SELECT * FROM `requests` WHERE owner='$user'";
$data['request'] = handleQuery($sql)->fetch_assoc();

response(200, 'Fetched profile', $data);

