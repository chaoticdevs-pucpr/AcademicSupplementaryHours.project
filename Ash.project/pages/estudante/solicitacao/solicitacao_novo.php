<?php
include_once('../../../z_php/conexao.php');
session_start();

$retorno = [
	'status' => '',
	'mensagem' => '',
	'data' => []
];

if(!isset($_SESSION['usuario']) || $_SESSION['usuario']['perfil'] != 'ESTUDANTE'){
	$retorno = ['status' => 'nok', 'mensagem' => 'Sem permissao.', 'data' => []];
	header("Content-type:application/json;charset:utf-8");
	echo json_encode($retorno);
	exit;
}

$estudante_id = (int)$_SESSION['usuario']['id'];

$stmtMatricula = $conexao->prepare("SELECT m.id, t.prof_validador_id FROM MATRICULA m INNER JOIN TURMA t ON t.id = m.turma_id WHERE m.estudante_id = ? ORDER BY m.id LIMIT 1");
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
$prof_validador_id = $matricula['prof_validador_id'];
$stmtMatricula->close();

if(isset($_POST['subcategoria_id'])){
	$subcategoria_id = (int)$_POST['subcategoria_id'];
	$horas_brutas = (float)$_POST['horas_brutas'];
	$justificativa = $_POST['justificativa'];

	$stmt = $conexao->prepare("INSERT INTO SOLICITACAO(matricula_id, subcategoria_id, prof_validador_id, horas_brutas, horas_validadas, status, justificativa) VALUES(?, ?, ?, ?, 0, 'PENDENTE', ?)");
	$stmt->bind_param("iiids", $matricula_id, $subcategoria_id, $prof_validador_id, $horas_brutas, $justificativa);
	$stmt->execute();
	if($stmt->affected_rows > 0){
		$solicitacao_id = $conexao->insert_id;
		$retorno = ['status' => 'ok', 'mensagem' => 'Registro inserido com sucesso.', 'data' => []];
	}else{
		$retorno = ['status' => 'nok', 'mensagem' => 'Falha ao inserir solicitacao.', 'data' => []];
	}
	$stmt->close();

	if($retorno['status'] == 'ok' && isset($_FILES['arquivo']) && $_FILES['arquivo']['error'] == 0){
		$pastaUploads = '../../uploads';
		if(!is_dir($pastaUploads)){
			mkdir($pastaUploads, 0777, true);
		}

		$nomeArquivo = basename($_FILES['arquivo']['name']);
		$nomeDestino = 'solicitacao_' . $solicitacao_id . '_' . preg_replace('/[^a-zA-Z0-9_.-]/', '_', $nomeArquivo);
		$caminhoFisico = $pastaUploads . '/' . $nomeDestino;
		$caminhoBanco = 'uploads/' . $nomeDestino;

		if(move_uploaded_file($_FILES['arquivo']['tmp_name'], $caminhoFisico)){
			$stmt = $conexao->prepare("DELETE FROM ANEXO WHERE solicitacao_id = ?");
			$stmt->bind_param("i", $solicitacao_id);
			$stmt->execute();
			$stmt->close();

			$stmt = $conexao->prepare("INSERT INTO ANEXO(solicitacao_id, caminho_arquivo) VALUES(?, ?)");
			$stmt->bind_param("is", $solicitacao_id, $caminhoBanco);
			$stmt->execute();
			$stmt->close();
		}
	}
}else{
	$retorno = ['status' => 'nok', 'mensagem' => 'Dados incompletos para inclusao.', 'data' => []];
}

$conexao->close();
header("Content-type:application/json;charset:utf-8");
echo json_encode($retorno);
