<?php
include_once('../../../../z_php/conexao.php');
session_start();

function jsonError($message, $code = 400) {
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['status' => 'nok', 'mensagem' => $message], JSON_UNESCAPED_UNICODE);
    exit;
}

if (!isset($_SESSION['usuario']) || $_SESSION['usuario']['perfil'] !== 'ESTUDANTE') {
    jsonError('Sem permissão.', 403);
}

if (!isset($_GET['anexo_id']) || !ctype_digit($_GET['anexo_id'])) {
    jsonError('Anexo inválido.', 400);
}

$anexoId = (int) $_GET['anexo_id'];
$estudanteId = (int) $_SESSION['usuario']['id'];

// Verificar se o anexo pertence ao estudante
$stmt = $conexao->prepare(
    "SELECT a.caminho_arquivo 
     FROM ANEXO a 
     INNER JOIN SOLICITACAO s ON s.id = a.solicitacao_id 
     INNER JOIN MATRICULA m ON m.id = s.matricula_id 
     WHERE a.id = ? AND m.estudante_id = ? 
     LIMIT 1"
);
$stmt->bind_param('ii', $anexoId, $estudanteId);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    jsonError('Arquivo não encontrado.', 404);
}

$row = $result->fetch_assoc();
$stmt->close();

$relativePath = $row['caminho_arquivo'];
$baseDir = realpath(__DIR__ . '/../..');
if ($baseDir === false) {
    jsonError('Erro de configuração de caminho.', 500);
}

$targetPath = realpath($baseDir . '/' . ltrim($relativePath, '/\\'));

if (!$targetPath || strpos($targetPath, $baseDir) !== 0 || !is_file($targetPath)) {
    jsonError('Arquivo indisponível.', 404);
}

$filename = basename($targetPath);
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mimeType = $finfo ? finfo_file($finfo, $targetPath) : 'application/octet-stream';
if ($finfo) {
    finfo_close($finfo);
}

header('Content-Type: ' . $mimeType);
header('Content-Disposition: inline; filename="' . addslashes($filename) . '"');
header('Content-Length: ' . filesize($targetPath));
header('X-Content-Type-Options: nosniff');
readfile($targetPath);
exit;
?>
