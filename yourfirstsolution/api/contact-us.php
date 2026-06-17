<?php
ob_start();

// CORS Headers
$allowed_origins = [
    'https://yourfirstsolution.com',
    'http://localhost:4200'
];

if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowed_origins)) {
    header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
}
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE, PUT");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Include your database connection
require 'db.php';

// Decode JSON payload
$data = json_decode(file_get_contents("php://input"), true);

// Validate required fields
$requiredFields = ['name', 'email', 'subject', 'message', 'phone'];
foreach ($requiredFields as $field) {
    if (empty($data[$field])) {
        http_response_code(400);
        echo json_encode(["error" => "Field '$field' is required."]);
        exit();
    }
}

// Save to database
$stmt = $conn->prepare("INSERT INTO contact_us (name, email, subject, message, phone) VALUES (?, ?, ?, ?, ?)");
if ($stmt === false) {
    http_response_code(500);
    echo json_encode(["error" => "Database prepare failed: " . $conn->error]);
    exit();
}

$stmt->bind_param("sssss", $data["name"], $data["email"], $data["subject"], $data["message"], $data["phone"]);

if ($stmt->execute()) {
    // ✅ Send email
    $to = 'yfs.production1@gmail.com';  
    $subject = "New Contact Submission: " . $data["subject"];
    $body = "You received a new message :\n\n"
          . "Name: " . $data["name"] . "\n"
          . "Email: " . $data["email"] . "\n"
          . "Phone: " . $data["phone"] . "\n\n"
          . "Message:\n" . $data["message"];
    $headers = "From: " . $data["email"] . "\r\n"
             . "Reply-To: " . $data["email"] . "\r\n"
             . "Content-Type: text/plain; charset=UTF-8";

    // Send the email
    if (mail($to, $subject, $body, $headers)) {
        echo json_encode(["message" => "Form submitted and email sent successfully."]);
    } else {
        echo json_encode(["message" => "Form submitted, but email failed to send."]);
    }
} else {
    http_response_code(500);
    echo json_encode(["error" => "Database execution error: " . $stmt->error]);
}

$stmt->close();
$conn->close();
ob_end_flush();
?>
