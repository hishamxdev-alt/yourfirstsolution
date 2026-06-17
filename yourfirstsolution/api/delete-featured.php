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

$input = json_decode(file_get_contents('php://input'), true);
$id = isset($input['id']) && is_numeric($input['id']) ? (int)$input['id'] : null;

if (!$id) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid ID']);
    exit;
}

try {
    $pdo = new PDO('mysql:host=localhost:3306;dbname=yfs_database;charset=utf8', 'yfs_admin', 'YFS_Supp@123', [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);

    $stmt = $pdo->prepare("SELECT image_src FROM featured WHERE id = ?");
    $stmt->execute([$id]);
    $image_src = $stmt->fetchColumn();

    $stmt = $pdo->prepare("DELETE FROM featured WHERE id = ?");
    $stmt->execute([$id]);

    if ($image_src) {
        $path = __DIR__ . '/' . $image_src;
        if (file_exists($path)) unlink($path);
    }

    echo json_encode(['success' => true, 'deleted_id' => $id]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error']);
}
?>
