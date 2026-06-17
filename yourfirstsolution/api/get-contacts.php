<?php
// Allow only specific origin for security
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

// Handle preflight (OPTIONS) requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require 'db.php'; // Your DB connection
header('Content-Type: application/json; charset=UTF-8');

// Query to get all contact form data
$sql = "
    SELECT 
        id, 
        name, 
        email, 
        subject, 
        message, 
        DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') AS created_at 
    FROM contact_us
";

if ($result = $conn->query($sql)) {
    $data = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
} else {
    echo json_encode([
        "error" => true,
        "message" => "Database query failed: " . $conn->error
    ]);
}

$conn->close();
?>
