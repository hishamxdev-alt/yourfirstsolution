<?php
// 🔒 CORS & Headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

ob_start();

// 🚦 Allow only POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Invalid request method']);
    exit;
}

// 🧪 Log debug info
file_put_contents(__DIR__ . '/upload_debug.log', "POST: " . print_r($_POST, true), FILE_APPEND);
file_put_contents(__DIR__ . '/upload_debug.log', "FILES: " . print_r($_FILES, true), FILE_APPEND);

// ✅ Validate image
if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['error' => 'Image upload failed']);
    exit;
}

// 📥 Inputs
$image       = $_FILES['image'];
$section_id  = $_POST['section_id'] ?? '';
$title       = htmlspecialchars(trim($_POST['title'] ?? ''), ENT_QUOTES, 'UTF-8');
$size        = $_POST['size'] ?? '';
$id          = isset($_POST['id']) && is_numeric($_POST['id']) ? (int)$_POST['id'] : null;

if (empty($section_id) || empty($size)) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields']);
    exit;
}

// 📡 DB connection
try {
    $pdo = new PDO('mysql:host=localhost:3306;dbname=yfs_database;charset=utf8', 'yfs_admin', 'YFS_Supp@123', [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);

    // 🔍 Get section name from DB
    $stmt = $pdo->prepare("SELECT name FROM sections WHERE id = ?");
    $stmt->execute([$section_id]);
    $sectionName = $stmt->fetchColumn();

    if (!$sectionName) {
        http_response_code(404);
        echo json_encode(['error' => 'Section not found']);
        exit;
    }

} catch (PDOException $e) {
    file_put_contents(__DIR__ . '/upload_debug.log', "DB ERROR: " . $e->getMessage() . "\n", FILE_APPEND);
    http_response_code(500);
    echo json_encode(['error' => 'Database error']);
    exit;
}

// 🧼 Clean section name (folder-safe)
$safeSection = preg_replace("/[^a-zA-Z0-9_\-]/", "_", $sectionName);

// 📁 Upload directory
$uploadDir = __DIR__ . "/uploads/$safeSection/";
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}
if (!is_writable($uploadDir)) {
    http_response_code(500);
    echo json_encode(['error' => 'Upload directory not writable']);
    exit;
}

// 📋 Validate image type and extension
$finfo     = new finfo(FILEINFO_MIME_TYPE);
$imageType = $finfo->file($image['tmp_name']);

$allowedMimeTypes = [
    'image/jpeg' => 'jpg',
    'image/png'  => 'png',
    'image/gif'  => 'gif',
    'image/webp' => 'webp',
    'image/bmp'  => 'bmp'
];

if (!array_key_exists($imageType, $allowedMimeTypes)) {
    http_response_code(400);
    echo json_encode(['error' => 'Unsupported image type']);
    exit;
}

$ext = $allowedMimeTypes[$imageType];
$filename = uniqid("img_") . "." . $ext;
$uploadPath = $uploadDir . $filename;
$relative   = "uploads/$safeSection/$filename";
$publicUrl  = "https://yourfirstsolution.com/" . $relative;

// 🚚 Move uploaded file
if (!move_uploaded_file($image['tmp_name'], $uploadPath)) {
    file_put_contents(__DIR__ . '/upload_debug.log', "MOVE FAILED\n", FILE_APPEND);
    http_response_code(500);
    echo json_encode(['error' => 'Failed to move uploaded image']);
    exit;
}

// 💾 Insert or update section_items
try {
    if ($id) {
        $stmt = $pdo->prepare("UPDATE section_items SET title = ?, image_src = ?, size = ?, section_id = ? WHERE id = ?");
        $stmt->execute([$title, $relative, $size, $section_id, $id]);
        $lastInsertId = $id;
    } else {
        $stmt = $pdo->prepare("INSERT INTO section_items (section_id, title, image_src, size) VALUES (?, ?, ?, ?)");
        $stmt->execute([$section_id, $title, $relative, $size]);
        $lastInsertId = $pdo->lastInsertId();
    }
} catch (PDOException $e) {
    file_put_contents(__DIR__ . '/upload_debug.log', "DB INSERT ERROR: " . $e->getMessage() . "\n", FILE_APPEND);
    http_response_code(500);
    echo json_encode(['error' => 'Database write failed']);
    exit;
}

// ✅ Final response
$response = [
    'id'         => $lastInsertId,
    'path'       => $relative,
    'url'        => $publicUrl,
    'section_id' => $section_id,
    'title'      => $title,
    'size'       => $size,
    'image_type' => $imageType
];

// 🧾 Log
file_put_contents(__DIR__ . '/upload_debug.log', "RESPONSE:\n" . print_r($response, true), FILE_APPEND);

// 🧹 Done
http_response_code(200);
ob_end_clean();
echo json_encode($response);
