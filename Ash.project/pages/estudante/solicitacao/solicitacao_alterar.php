<?php
include_once('../../../z_php/conexao.php');
session_start();

$retorno = [
    'status'    => '',
    'mensagem'  => '',
    'data'      => []
];

if(!isset($_SESSION['usuario']) || $_SESSION['usuario']['perfil'] != 'ESTUDANTE'){
    $retorno = ['status' => 'nok', 'mensagem' => 'Sem permissao.', 'data' => []];
    header("Content-type:application/json;charset:utf-8");
    echo json_encode($retorno);
    exit;
}

$estudante_id = (int)$_SESSION['usuario']['id'];

$stmtMatricula = $conexao->prepare("SELECT m.id FROM MATRICULA m WHERE m.estudante_id = ? ORDER BY m.id LIMIT 1");
$stmtMatricula->bind_param("i", $estudante_id);
$stmtMatricula->execute();
$resMatricula = $stmtMatricula->get_result();

if($resMatricula->num_rows == 0){
    $retorno = ['status' => 'nok', 'mensagem' => 'Estudante sem matricula ativa.', 'data' => []];
    header("Content-type:application/json;charset:utf-8");
    echo json_encode($retorno);
    exit;
}

$matricula = $resMatricula->fetch_assoc();
$matricula_id = (int)$matricula['id'];
$stmtMatricula->close();

if(isset($_GET['id']) && isset($_POST['subcategoria_id'], $_POST['horas_brutas'], $_POST['justificativa'])){
    $id = (int)$_GET['id'];
    $subcategoria_id = (int)$_POST['subcategoria_id'];
    $horas_brutas = (float)$_POST['horas_brutas'];
    $justificativa = $_POST['justificativa'];

    $stmt = $conexao->prepare("UPDATE SOLICITACAO SET subcategoria_id = ?, horas_brutas = ?, justificativa = ? WHERE id = ? AND matricula_id = ? AND status = 'PENDENTE'");
    $stmt->bind_param("idsii", $subcategoria_id, $horas_brutas, $justificativa, $id, $matricula_id);
    $stmt->execute();

    if($stmt->affected_rows > 0){
        $retorno = ['status' => 'ok', 'mensagem' => 'Registro alterado com sucesso.', 'data' => []];
    }else{
        $retorno = ['status' => 'nok', 'mensagem' => 'Nao foi possivel alterar.', 'data' => []];
    }

    $stmt->close();

    if($retorno['status'] == 'ok' && isset($_FILES['arquivo']) && $_FILES['arquivo']['error'] == 0){
        $pastaUploads = '../../uploads';

        if(!is_dir($pastaUploads)){
            mkdir($pastaUploads, 0777, true);
        }

        $nomeArquivo = basename($_FILES['arquivo']['name']);
        $nomeDestino = 'solicitacao_' . $id . '_' . preg_replace('/[^a-zA-Z0-9_.-]/', '_', $nomeArquivo);
        $caminhoFisico = $pastaUploads . '/' . $nomeDestino;
        $caminhoBanco = 'uploads/' . $nomeDestino;

        if(move_uploaded_file($_FILES['arquivo']['tmp_name'], $caminhoFisico)){
            $stmt = $conexao->prepare("DELETE FROM ANEXO WHERE solicitacao_id = ?");
            $stmt->bind_param("i", $id);
            $stmt->execute();
            $stmt->close();

            $stmt = $conexao->prepare("INSERT INTO ANEXO(solicitacao_id, caminho_arquivo) VALUES(?, ?)");
            $stmt->bind_param("is", $id, $caminhoBanco);
            $stmt->execute();
            $stmt->close();
        }
    }
}else{
    $retorno = ['status' => 'nok', 'mensagem' => 'Nao posso alterar sem informar ID.', 'data' => []];
}

$conexao->close();

header("Content-type:application/json;charset:utf-8");
echo json_encode($retorno);
