<?php
$allowed_origins = [
    "https://yourfirstsolution.com",
    "https://www.yourfirstsolution.com",
	"http://localhost:4200"
];

if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowed_origins)) {
   header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
} else {
    header("Access-Control-Allow-Origin: https://yourfirstsolution.com");
}
//header('Access-Control-Allow-Origin: *');

header("Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE, PUT");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(204);
    exit();
}

require 'db.php'; // ✅ Make sure this is silent (no echo or print)

header('Content-Type: application/json');
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['device_type']) || empty($data['device_type'])) {
    echo json_encode(["error" => "Device type is required"]);
    exit();
}

$deviceType = $data['device_type'];

$stmt = $conn->prepare("INSERT INTO visitors (device_type, visit_time) VALUES (?, NOW())");
$stmt->bind_param("s", $deviceType);
$stmt->execute();
$stmt->close();
$conn->close();

echo json_encode([
    "message" => "Visitor tracked successfully",
    "device" => $deviceType
]);
?>
