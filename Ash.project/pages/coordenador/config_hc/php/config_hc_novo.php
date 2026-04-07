<?php
include_once('../../../../z_php/conexao.php');
session_start();

$retorno = [
	'status' => '',
	'mensagem' => '',
	'data' => []
];

if(!isset($_SESSION['usuario']) || $_SESSION['usuario']['perfil'] != 'COORDENADOR'){
	$retorno = ['status' => 'nok', 'mensagem' => 'Sem permissao.', 'data' => []];
	header("Content-type:application/json;charset:utf-8");
	echo json_encode($retorno);
	exit;
}

$coordenador_id = (int)$_SESSION['usuario']['id'];
$stmtCurso = $conexao->prepare("SELECT curso_id FROM COORDENADOR WHERE usuario_id = ?");
$stmtCurso->bind_param("i", $coordenador_id);
$stmtCurso->execute();
$resCurso = $stmtCurso->get_result();
if($resCurso->num_rows == 0){
	$retorno = ['status' => 'nok', 'mensagem' => 'Coordenador sem curso vinculado.', 'data' => []];
	header("Content-type:application/json;charset:utf-8");
	echo json_encode($retorno);
	exit;
}
$curso = $resCurso->fetch_assoc();
$curso_id = (int)$curso['curso_id'];
$stmtCurso->close();

if(isset($_POST['versao'])){
	$versao = $_POST['versao'];
	$data_manual = $_POST['data_manual'];
	$horas_objetivo = (int)$_POST['horas_objetivo'];
	$categoria_nome = $_POST['categoria_nome'];
	$categoria_max = (int)$_POST['categoria_max'];
	$subcategoria_nome = $_POST['subcategoria_nome'];
	$subcategoria_horas = (int)$_POST['subcategoria_horas'];

	$stmt = $conexao->prepare("INSERT INTO MANUAL_HC(curso_id, horas_objetivo, versao, data) VALUES(?,?,?,?)");
	$stmt->bind_param("iiss", $curso_id, $horas_objetivo, $versao, $data_manual);
	$stmt->execute();
	if($stmt->affected_rows > 0){
		$manual_id = $conexao->insert_id;
		$stmt->close();

		$stmt = $conexao->prepare("INSERT INTO CATEGORIA(manual_hc_id, max_horas, nome) VALUES(?,?,?)");
		$stmt->bind_param("iis", $manual_id, $categoria_max, $categoria_nome);
		$stmt->execute();

		if($stmt->affected_rows > 0){
			$categoria_id = $conexao->insert_id;
			$stmt->close();

			$stmt = $conexao->prepare("INSERT INTO SUBCATEGORIA(categoria_id, quant_horas, nome) VALUES(?,?,?)");
			$stmt->bind_param("iis", $categoria_id, $subcategoria_horas, $subcategoria_nome);
			$stmt->execute();

			if($stmt->affected_rows > 0){
				$retorno = ['status' => 'ok', 'mensagem' => 'Registro inserido com sucesso.', 'data' => []];
			}else{
				$retorno = ['status' => 'nok', 'mensagem' => 'Falha ao inserir subcategoria.', 'data' => []];
			}
		}else{
			$retorno = ['status' => 'nok', 'mensagem' => 'Falha ao inserir categoria.', 'data' => []];
		}
	}else{
		$retorno = ['status' => 'nok', 'mensagem' => 'Falha ao inserir manual.', 'data' => []];
	}
	$stmt->close();
}else{
	$retorno = ['status' => 'nok', 'mensagem' => 'Dados incompletos para inclusao.', 'data' => []];
}

$conexao->close();
header("Content-type:application/json;charset:utf-8");
echo json_encode($retorno);
