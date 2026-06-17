<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

ob_start();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Invalid request method']);
    exit;
}

$image_src = $_FILES['image_src'] ?? null;
$title = htmlspecialchars(trim($_POST['title'] ?? ''), ENT_QUOTES, 'UTF-8');
$subTitle = htmlspecialchars(trim($_POST['sub_title'] ?? ''), ENT_QUOTES, 'UTF-8');
$description = htmlspecialchars(trim($_POST['description'] ?? ''), ENT_QUOTES, 'UTF-8');
$id = isset($_POST['id']) && is_numeric($_POST['id']) ? (int)$_POST['id'] : null;

if (empty($title)) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing title']);
    exit;
}

try {
    $pdo = new PDO('mysql:host=localhost:3306;dbname=yfs_database;charset=utf8', 'yfs_admin', 'YFS_Supp@123', [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}

$uploadDir = __DIR__ . "/uploads/featured/";
if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);

$image_srcPath = null;
if ($image_src && $image_src['error'] === UPLOAD_ERR_OK) {
    $ext = pathinfo($image_src['name'], PATHINFO_EXTENSION);
    $filename = uniqid("featured_") . "." . $ext;
    $uploadPath = $uploadDir . $filename;
    $image_srcPath = "uploads/featured/" . $filename;
    move_uploaded_file($image_src['tmp_name'], $uploadPath);
}

try {
    if ($id) {
        $stmt = $pdo->prepare("UPDATE featured SET title = ?, sub_title = ?, description = ?" . ($image_srcPath ? ", image_src = ?" : "") . " WHERE id = ?");
        $params = [$title, $subTitle, $description];
        if ($image_srcPath) $params[] = $image_srcPath;
        $params[] = $id;
        $stmt->execute($params);
    } else {
        if (!$image_srcPath) {
            http_response_code(400);
            echo json_encode(['error' => 'image_src required for new entry']);
            exit;
        }
        $stmt = $pdo->prepare("INSERT INTO featured (title, sub_title, description, image_src) VALUES (?, ?, ?, ?)");
        $stmt->execute([$title, $subTitle, $description, $image_srcPath]);
        $id = $pdo->lastInsertId();
    }

    echo json_encode(['success' => true, 'id' => $id, 'image_src' => $image_srcPath]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error']);
}
?>
