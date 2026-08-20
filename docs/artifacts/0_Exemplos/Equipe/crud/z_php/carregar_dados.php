<?php
header('Content-Type: application/json');
require 'conexao.php';

try {
    $tipo = $_GET['tipo'] ?? '';
    
    if ($tipo === 'cursos') {
        $resultado = $conexao->query("SELECT id, nome FROM curso ORDER BY nome");
        $cursos = $resultado->fetch_all(MYSQLI_ASSOC);
        echo json_encode($cursos);
    } elseif ($tipo === 'turmas') {
        $resultado = $conexao->query("SELECT id, nome FROM turma ORDER BY nome");
        $turmas = $resultado->fetch_all(MYSQLI_ASSOC);
        echo json_encode($turmas);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['erro' => $e->getMessage()]);
}
?>
