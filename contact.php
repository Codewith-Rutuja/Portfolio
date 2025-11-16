<?php
// Configuration
$TO_EMAIL = "rutujabhosale0410@gmail.com"; // Change to your working email address
$FROM_EMAIL = "no-reply@yourdomain.com"; // Optional
$SAVE_FILE = __DIR__ . "/messages.log"; // Local file where messages are saved

header("Content-Type: application/json");

// Read and decode incoming JSON POST data
$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

if (!$data || !isset($data["name"]) || !isset($data["email"]) || !isset($data["message"])) {
  echo json_encode(["ok" => false, "error" => "Invalid payload"]);
  exit;
}

$name = trim($data["name"]);
$email = trim($data["email"]);
$message = trim($data["message"]);

if ($name === "" || $email === "" || $message === "") {
  echo json_encode(["ok" => false, "error" => "Missing fields"]);
  exit;
}

// Email format check
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  echo json_encode(["ok" => false, "error" => "Invalid email"]);
  exit;
}

// Log to file (append)
$entry = sprintf(
  "[%s] Name: %s | Email: %s\nMessage:\n%s\n------------------\n",
  date("Y-m-d H:i:s"),
  $name,
  $email,
  $message
);
file_put_contents($SAVE_FILE, $entry, FILE_APPEND);

// Email notification
$subject = "New portfolio contact from $name";
$body = "Name: $name\nEmail: $email\n\nMessage:\n$message\n";
$headers  = "From: $FROM_EMAIL\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

$sent = @mail($TO_EMAIL, $subject, $body, $headers);

echo json_encode(["ok" => $sent ? true : false]);
