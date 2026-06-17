<?php
// Debug mode (disable in production)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// CORS and content headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

// Parse JSON input
$input = json_decode(file_get_contents('php://input'), true);
$id = isset($input['id']) && is_string($input['id']) ? trim($input['id']) : null;

if (!$id) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing or invalid media ID']);
    exit;
}

try {
    // Connect to DB
    $pdo = new PDO(
        'mysql:host=localhost;port=3306;dbname=yfs_database;charset=utf8',
        'yfs_admin',
        'YFS_Supp@123',
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );

    // Check if media exists
    $stmt = $pdo->prepare("SELECT id FROM media_production WHERE id = ?");
    $stmt->execute([$id]);
    $exists = $stmt->fetchColumn();

    if (!$exists) {
        http_response_code(404);
        echo json_encode(['error' => 'Media entry not found']);
        exit;
    }

    // Delete media entry
    $stmt = $pdo->prepare("DELETE FROM media_production WHERE id = ?");
    $stmt->execute([$id]);

    echo json_encode(['success' => true, 'deleted_id' => $id]);
} catch (PDOException $e) {
    error_log("🔥 PDO Exception: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Server error. Check logs for details.']);
}
