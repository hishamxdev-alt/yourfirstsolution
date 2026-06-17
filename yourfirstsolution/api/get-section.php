<?php
// 🔐 CORS Setup for Angular Dev Environment
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE, PUT");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

// 🛑 Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 🌐 Set response type
header('Content-Type: application/json');

// 🧩 Database config (if in separate file)
require 'db.php'; // make sure this sets up $conn properly

// 🔎 Get 'section' from query
$section = $_GET['section'] ?? '';

if ($section === '') {
    http_response_code(400);
    echo json_encode(["error" => "Missing 'section' parameter"]);
    exit();
}

// 🛠️ Prepared query to fetch section items
$stmt = $conn->prepare("SELECT id, title, image_src, size FROM section_items WHERE section_id = ?  ORDER BY id ASC ");
$stmt->bind_param("s", $section);
$stmt->execute();
$result = $stmt->get_result();

// 📦 Collect and return data
$items = [];
while ($row = $result->fetch_assoc()) {
    $items[] = $row;
}

if (empty($items)) {
    http_response_code(404);
    echo json_encode(["error" => "No items found for this section"]);
} else {
    echo json_encode($items);
}

$stmt->close();
$conn->close();
?>
