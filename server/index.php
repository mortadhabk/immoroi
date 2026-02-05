<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['message' => 'Méthode non autorisée.']);
  exit;
}

// Rate limit simple (par IP, 12 req / min)
$rateFile = sys_get_temp_dir() . '/immoroi_feedback_rate.json';
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$now = time();
$window = 60;
$maxReq = 12;
$rates = [];
if (file_exists($rateFile)) {
  $rates = json_decode((string)file_get_contents($rateFile), true) ?: [];
}
$entry = $rates[$ip] ?? ['count' => 0, 'ts' => $now];
if ($now - $entry['ts'] > $window) {
  $entry = ['count' => 1, 'ts' => $now];
} else {
  if ($entry['count'] >= $maxReq) {
    http_response_code(429);
    echo json_encode(['message' => 'Trop de requêtes. Réessayez plus tard.']);
    exit;
  }
  $entry['count'] += 1;
}
$rates[$ip] = $entry;
file_put_contents($rateFile, json_encode($rates));

$raw = file_get_contents('php://input');
$data = json_decode((string)$raw, true);

if (!is_array($data)) {
  http_response_code(400);
  echo json_encode(['message' => 'Payload invalide.']);
  exit;
}

$email = trim((string)($data['email'] ?? ''));
$type = trim((string)($data['type'] ?? ''));
$subject = trim((string)($data['subject'] ?? ''));
$description = trim((string)($data['description'] ?? ''));

if ($email === '' || $type === '' || $subject === '' || $description === '') {
  http_response_code(400);
  echo json_encode(['message' => 'Champs requis manquants.']);
  exit;
}
if (mb_strlen($subject) > 120) {
  http_response_code(400);
  echo json_encode(['message' => 'Sujet trop long.']);
  exit;
}
if (mb_strlen($description) > 2000) {
  http_response_code(400);
  echo json_encode(['message' => 'Description trop longue.']);
  exit;
}

$payload = [
  'id' => 'fb_' . time(),
  'userId' => $data['userId'] ?? null,
  'name' => $data['name'] ?? null,
  'email' => $email,
  'type' => $type,
  'subject' => $subject,
  'description' => $description,
  'impact' => $data['impact'] ?? 'Moyen',
  'modules' => is_array($data['modules'] ?? null) ? $data['modules'] : [],
  'allowContact' => (bool)($data['allowContact'] ?? false),
  'sourcePage' => $data['sourcePage'] ?? '',
  'status' => 'nouveau',
  'createdAt' => date('c'),
];

$destination = 'mortadhaboubaker12@gmail.com';
$emailSubject = '[ImmoROI] Nouvelle suggestion';
$emailBody = "Type: {$payload['type']}\n"
  . "Sujet: {$payload['subject']}\n"
  . "Email: {$payload['email']}\n"
  . "Impact: {$payload['impact']}\n"
  . "Modules: " . implode(', ', $payload['modules']) . "\n"
  . "Source: {$payload['sourcePage']}\n"
  . "Autorise contact: " . ($payload['allowContact'] ? 'Oui' : 'Non') . "\n\n"
  . "Description:\n{$payload['description']}\n";
$headers = "From: ImmoROI <no-reply@immoroi.local>\r\nReply-To: {$payload['email']}";
@mail($destination, $emailSubject, $emailBody, $headers);

$dataDir = __DIR__ . '/../data';
$dataFile = $dataDir . '/feedback.json';
if (!is_dir($dataDir)) {
  mkdir($dataDir, 0777, true);
}
if (!file_exists($dataFile)) {
  file_put_contents($dataFile, json_encode([]));
}

$list = json_decode((string)file_get_contents($dataFile), true);
if (!is_array($list)) {
  $list = [];
}
$list[] = $payload;
file_put_contents($dataFile, json_encode($list, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

echo json_encode(['ok' => true]);
