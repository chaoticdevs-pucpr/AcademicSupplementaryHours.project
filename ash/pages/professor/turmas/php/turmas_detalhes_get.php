<?php
include_once('../../../../z_php/conexao.php');
session_start();

$retorno = [
    'status' => '',
    'mensagem' => '',
    'data' => []
];

if(!isset($_SESSION['usuario']) || $_SESSION['usuario']['perfil'] != 'PROFESSOR'){
    $retorno = ['status' => 'nok', 'mensagem' => 'Sem permissao.', 'data' => []];
    header("Content-Type: application/json; charset=utf-8");
    echo json_encode($retorno, JSON_UNESCAPED_UNICODE);
    exit;
}

if(isset($_GET['turma'])){
    $turma_id = (int)$_GET['turma'];
    $status = isset($_GET['status']) ? $_GET['status'] : 'PENDENTE';

    $stmt = $conexao->prepare("SELECT s.id as id, s.status as status, s.data_envios as data_envio, u.nome AS aluno FROM SOLICITACAO s INNER JOIN MATRICULA m ON s.matricula_id = m.id INNER JOIN ESTUDANTE e ON m.estudante_id = e.usuario_id INNER JOIN USUARIO u ON e.usuario_id = u.id WHERE s.turma_id = ? AND s.status = ? ORDER BY s.data_envios DESC");
    $stmt->bind_param("is", $turma_id, $status);
    $stmt->execute();
    $resultado = $stmt->get_result();
    $tabela = [];
    $stmtAnexos = $conexao->prepare("SELECT id, caminho_arquivo FROM ANEXO WHERE solicitacao_id = ? ORDER BY id ASC");
    while($linha = $resultado->fetch_assoc()){
        $linha['anexos'] = [];
        $stmtAnexos->bind_param("i", $linha['id']);
        $stmtAnexos->execute();
        $resultadoAnexos = $stmtAnexos->get_result();
        while($anexo = $resultadoAnexos->fetch_assoc()){
            $linha['anexos'][] = $anexo;
        }
        $tabela[] = $linha;
    }
    $stmtAnexos->close();
    $stmt->close();

    $retorno = ['status' => 'ok', 'mensagem' => 'Consulta efetuada.', 'data' => $tabela];
    $conexao->close();
    header("Content-Type: application/json; charset=utf-8");
    echo json_encode($retorno, JSON_UNESCAPED_UNICODE);
    exit;
}

$retorno = ['status' => 'nok', 'mensagem' => 'Parametros insuficientes.', 'data' => []];
$conexao->close();
header("Content-Type: application/json; charset=utf-8");
echo json_encode($retorno, JSON_UNESCAPED_UNICODE);
exit;