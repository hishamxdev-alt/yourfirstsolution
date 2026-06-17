 
<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE, PUT");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}
require 'db.php';
header('Content-Type: application/json');

$sql = "SELECT COUNT(*) AS total_visits, 
    SUM(CASE WHEN device_type = 'mobile' THEN 1 ELSE 0 END) AS mobile_visits,
    SUM(CASE WHEN device_type = 'desktop' THEN 1 ELSE 0 END) AS desktop_visits
    FROM visitors";

$result = $conn->query($sql);
$data = $result->fetch_assoc();
$conn->close();

echo json_encode($data);
?>