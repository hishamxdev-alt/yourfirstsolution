<?php
// Database credentials
$servername = "localhost:3306";
$username = "yfs_admin"; // ✅ change this
$password = "YFS_Supp@123"; // ✅ change this
$dbname = "yfs_database";   // ✅ change this

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    // Return JSON error and stop further processing
    http_response_code(500); // Internal Server Error
    echo json_encode([
        "error" => "Connection failed: " . $conn->connect_error
    ]);
    exit();
}
?>
