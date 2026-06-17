<?php
// CORS Headers
$allowed_origins = [
    'https://yourfirstsolution.com',
    'http://localhost:4200'
];

if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowed_origins)) {
    header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
}
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

// Database credentials
$dsn = 'mysql:host=localhost:3306;dbname=yfs_database;charset=utf8';
$username = 'yfs_admin';
$password = 'YFS_Supp@123';
$baseUrl = 'https://yourfirstsolution.com/api/uploads/banners/';

try {
    $pdo = new PDO($dsn, $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);

    // ---------------- GET REQUEST ----------------
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $stmt = $pdo->query("SELECT id, title, subtitle, background_image, video 
                             FROM banners 
                             ORDER BY updated_at DESC 
                             LIMIT 1");
        $banner = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($banner) {
            $banner['title'] = htmlspecialchars_decode($banner['title']);
            $banner['subtitle'] = htmlspecialchars_decode($banner['subtitle']);
            $banner['background_image'] = $banner['background_image'] 
                ? $baseUrl . basename($banner['background_image']) 
                : null;
            $banner['video'] = $banner['video'] 
                ? $baseUrl . basename($banner['video']) 
                : null;
        }

        echo json_encode([
            'success' => (bool) $banner,
            'banner' => $banner ?: null,
            'message' => $banner ? null : 'No banner found'
        ]);
        exit;
    }

    // ---------------- POST REQUEST ----------------
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['error' => 'Invalid request method']);
        exit;
    }

    // Sanitize text inputs
    $title = htmlspecialchars(trim($_POST['title'] ?? ''), ENT_QUOTES, 'UTF-8');
    $subtitle = htmlspecialchars(trim($_POST['subtitle'] ?? ''), ENT_QUOTES, 'UTF-8');
    $id = isset($_POST['id']) && is_numeric($_POST['id']) ? (int) $_POST['id'] : null;

    // ---------- IMAGE UPLOAD ----------
    $backgroundPath = null;
    if (!empty($_FILES['background_image']) && $_FILES['background_image']['error'] === UPLOAD_ERR_OK) {
        $finfo = new finfo(FILEINFO_MIME_TYPE);
        $mimeType = $finfo->file($_FILES['background_image']['tmp_name']);
        $allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];

        if (!in_array($mimeType, $allowedTypes)) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid image format']);
            exit;
        }

        $uploadDir = __DIR__ . '/uploads/banners/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        $ext = pathinfo($_FILES['background_image']['name'], PATHINFO_EXTENSION);
        $filename = uniqid('banner_') . '.' . $ext;
        $fullPath = $uploadDir . $filename;
        $backgroundPath = 'uploads/banners/' . $filename;

        if (!move_uploaded_file($_FILES['background_image']['tmp_name'], $fullPath)) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to save uploaded image']);
            exit;
        }
    }

    // ---------- VIDEO UPLOAD ----------
    $videoPath = null;
    if (!empty($_FILES['video']) && $_FILES['video']['error'] === UPLOAD_ERR_OK) {
        $finfo = new finfo(FILEINFO_MIME_TYPE);
        $mimeType = $finfo->file($_FILES['video']['tmp_name']);
        $allowedVideoTypes = ['video/mp4', 'video/webm', 'video/ogg'];

        if (!in_array($mimeType, $allowedVideoTypes)) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid video format']);
            exit;
        }

        $uploadDir = __DIR__ . '/uploads/banners/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        $ext = pathinfo($_FILES['video']['name'], PATHINFO_EXTENSION);
        $filename = uniqid('banner_video_') . '.' . $ext;
        $fullPath = $uploadDir . $filename;
        $videoPath = 'uploads/banners/' . $filename;

        if (!move_uploaded_file($_FILES['video']['tmp_name'], $fullPath)) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to save uploaded video']);
            exit;
        }
    }

    // ---------- UPDATE EXISTING ----------
    if ($id) {
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM banners WHERE id = ?");
        $stmt->execute([$id]);
        $exists = $stmt->fetchColumn();

        if ($exists) {
            $sql = "UPDATE banners SET title = ?, subtitle = ?, updated_at = NOW()";
            $params = [$title, $subtitle];

            if ($backgroundPath) {
                $sql .= ", background_image = ?";
                $params[] = $backgroundPath;
            }
            if ($videoPath) {
                $sql .= ", video = ?";
                $params[] = $videoPath;
            }

            $sql .= " WHERE id = ?";
            $params[] = $id;

            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);

            echo json_encode([
                'success' => true,
                'id' => $id,
                'title' => htmlspecialchars_decode($title),
                'subtitle' => htmlspecialchars_decode($subtitle),
                'background_image' => $backgroundPath ? $baseUrl . basename($backgroundPath) : null,
                'video' => $videoPath ? $baseUrl . basename($videoPath) : null,
                'message' => 'Banner updated'
            ]);
            exit;
        }
    }

    // ---------- INSERT NEW ----------
    $stmt = $pdo->prepare("INSERT INTO banners (title, subtitle, background_image, video, updated_at) VALUES (?, ?, ?, ?, NOW())");
    $stmt->execute([$title, $subtitle, $backgroundPath, $videoPath]);
    $newId = $pdo->lastInsertId();

    echo json_encode([
        'success' => true,
        'id' => $newId,
        'title' => htmlspecialchars_decode($title),
        'subtitle' => htmlspecialchars_decode($subtitle),
        'background_image' => $backgroundPath ? $baseUrl . basename($backgroundPath) : null,
        'video' => $videoPath ? $baseUrl . basename($videoPath) : null,
        'message' => 'Banner created'
    ]);
    exit;

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>
