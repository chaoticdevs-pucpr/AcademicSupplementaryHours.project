<?php
include_once('../../../z_php/conexao.php');
session_start();

$retorno = [
	'status' => '',
	'mensagem' => '',
	'data' => []
];

if(!isset($_SESSION['usuario']) || $_SESSION['usuario']['perfil'] != 'ADMIN'){
	$retorno = ['status' => 'nok', 'mensagem' => 'Sem permissao.', 'data' => []];
	header("Content-type:application/json;charset:utf-8");
	echo json_encode($retorno);
	exit;
}

if(isset($_POST['nome'], $_POST['email'], $_POST['senha'], $_POST['cpf'], $_POST['celular'], $_POST['telefone'], $_POST['turma_id'])){
	$nome = $_POST['nome'];
	$email = $_POST['email'];
	$senha = $_POST['senha'];
	$cpf = $_POST['cpf'];
	$celular = $_POST['celular'];
	$telefone = $_POST['telefone'];
	$turma_id = (int)$_POST['turma_id'];
	if($turma_id <= 0){
		$retorno = ['status' => 'nok', 'mensagem' => 'Selecione uma turma valida.', 'data' => []];
		header("Content-type:application/json;charset:utf-8");
		echo json_encode($retorno);
		exit;
	}
	$admin_id = (int)$_SESSION['usuario']['id'];

	$stmt = $conexao->prepare("INSERT INTO USUARIO(email, senha, perfil) VALUES(?, ?, 'ESTUDANTE')");
	$stmt->bind_param("ss", $email, $senha);
	$stmt->execute();
	if($stmt->affected_rows > 0){
		$usuario_id = $conexao->insert_id;
		$stmt->close();

		$stmt = $conexao->prepare("INSERT INTO ESTUDANTE(usuario_id, nome, cpf, celular, telefone, cadastrado_por_admin_id) VALUES(?,?,?,?,?,?)");
		$stmt->bind_param("issssi", $usuario_id, $nome, $cpf, $celular, $telefone, $admin_id);
		$stmt->execute();

		if($stmt->affected_rows > 0){
			$stmt->close();

			$stmt = $conexao->prepare("INSERT INTO MATRICULA(estudante_id, turma_id) VALUES(?,?)");
			$stmt->bind_param("ii", $usuario_id, $turma_id);
			$stmt->execute();

			if($stmt->affected_rows > 0){
				$retorno = ['status' => 'ok', 'mensagem' => 'Registro inserido com sucesso.', 'data' => []];
			}else{
				$retorno = ['status' => 'nok', 'mensagem' => 'Falha ao inserir matricula.', 'data' => []];
			}
		}else{
			$retorno = ['status' => 'nok', 'mensagem' => 'Falha ao inserir estudante.', 'data' => []];
		}
	}else{
		$retorno = ['status' => 'nok', 'mensagem' => 'Falha ao inserir usuario.', 'data' => []];
	}
	$stmt->close();
}else{
	$retorno = ['status' => 'nok', 'mensagem' => 'Dados incompletos para inclusao.', 'data' => []];
}

$conexao->close();
header("Content-type:application/json;charset:utf-8");
echo json_encode($retorno);
