<?php
$allowed_origins = [
    'https://yourfirstsolution.com',
    'http://localhost:4200'
];

if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowed_origins)) {
    header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
}
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

$dsn = 'mysql:host=localhost:3306;dbname=yfs_database;charset=utf8';
$username = 'yfs_admin';
$password = 'YFS_Supp@123';

try {
    $pdo = new PDO($dsn, $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['message' => 'Invalid request method']);
        exit;
    }

    // 🔍 Read JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    $id = isset($input['ID']) && is_numeric($input['ID']) ? (int)$input['ID'] : null;

    if (!$id) {
        http_response_code(400);
        echo json_encode(['message' => 'Missing or invalid ID']);
        exit;
    }

    // 🔍 Fetch image path before deletion
    $stmt = $pdo->prepare("SELECT image_src FROM section_items WHERE id = ?");
    $stmt->execute([$id]);
    $imagePath = $stmt->fetchColumn();

    // 🗑️ Delete record
    $stmt = $pdo->prepare("DELETE FROM section_items WHERE id = ?");
    $stmt->execute([$id]);

    // 🧹 Optionally delete image file
    if ($imagePath) {
        $fullPath = __DIR__ . '/' . $imagePath;
        if (file_exists($fullPath)) {
            unlink($fullPath);
        }
    }

    echo json_encode(['message' => 'Item deleted successfully', 'deleted_id' => $id]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Database error: ' . $e->getMessage()]);
}
?>
