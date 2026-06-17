<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
ob_start();

$dsn = 'mysql:host=localhost:3306;dbname=yfs_database;charset=utf8';
$username = 'yfs_admin';
$password = 'YFS_Supp@123';
$baseUrl = 'https://yourfirstsolution.com/api/';
$uploadDir = __DIR__ . '/partners/';

try {
    $pdo = new PDO($dsn, $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);

    // 🔍 GET: Fetch all partners
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $stmt = $pdo->query("SELECT id, name, logo FROM partners ORDER BY updated_at ASC");
        $partners = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Prepend full URL to each logo
        foreach ($partners as &$partner) {
            if (!empty($partner['logo'])) {
                $partner['logo'] = $baseUrl . $partner['logo'];
            }
        }

        echo json_encode([
            'success' => true,
            'partners' => $partners
        ]);
        exit;
    }

    // 🚫 Reject non-POST requests
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['error' => 'Invalid request method']);
        exit;
    }

    // 🧼 Validate and sanitize input
    $name = htmlspecialchars(trim($_POST['name'] ?? ''), ENT_QUOTES, 'UTF-8');
    if (empty($name)) {
        http_response_code(400);
        echo json_encode(['error' => 'Partner name is required']);
        exit;
    }

    // 📁 Ensure upload directory exists
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }
    if (!is_writable($uploadDir)) {
        http_response_code(500);
        echo json_encode(['error' => 'Upload directory not writable']);
        exit;
    }

    // 🖼️ Handle logo upload
    $logoPath = null;
    if (!empty($_FILES['logo']) && $_FILES['logo']['error'] === UPLOAD_ERR_OK) {
        $finfo = new finfo(FILEINFO_MIME_TYPE);
        $mimeType = $finfo->file($_FILES['logo']['tmp_name']);
        $allowedMime = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

        if (!in_array($mimeType, $allowedMime)) {
            http_response_code(400);
            echo json_encode(['error' => 'Unsupported logo type']);
            exit;
        }

        $ext = pathinfo($_FILES['logo']['name'], PATHINFO_EXTENSION);
        $filename = uniqid('partner_') . '.' . $ext;
        $logoPath = $filename;
        $fullPath = $uploadDir . $filename;

        if (!move_uploaded_file($_FILES['logo']['tmp_name'], $fullPath)) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to save logo']);
            exit;
        }
    }

    // 🗃️ Insert into database
    $stmt = $pdo->prepare("INSERT INTO partners (name, logo) VALUES (?, ?)");
    $stmt->execute([$name, $logoPath]);
    $id = $pdo->lastInsertId();

    echo json_encode([
        'success' => true,
        'id' => $id,
        'name' => $name,
        'logo' => $logoPath ? $baseUrl . $logoPath : null
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>
