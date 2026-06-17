<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Enable error reporting for debugging (optional in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Connect to database
include 'db.php'; // Assumes $conn is defined

// Ensure charset is set for Arabic and rich text
$conn->set_charset("utf8mb4");

$data = [];

$sql = "SELECT * FROM news ORDER BY id ASC";
$result = $conn->query($sql);

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        // Decode only text-based fields
        $row['title'] = html_entity_decode($row['title'] ?? '', ENT_QUOTES | ENT_HTML5, 'UTF-8');
        $row['sub_title'] = html_entity_decode($row['sub_title'] ?? '', ENT_QUOTES | ENT_HTML5, 'UTF-8');
        $row['description'] = html_entity_decode($row['description'] ?? '', ENT_QUOTES | ENT_HTML5, 'UTF-8');
        $data[] = $row;
    }
} else {
    http_response_code(204); // No content
}

echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
$conn->close();
?>
