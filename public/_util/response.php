<?php

function response(int $status, string $message, array $data = null) {
  header("Content-Type: application/json");
  http_response_code($status);
  echo json_encode([
    "status"  => $status,
    "message" => $message,
    "data"    => $data
  ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
  die;
}