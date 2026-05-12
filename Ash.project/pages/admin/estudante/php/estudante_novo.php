<?php
include_once('../../../../z_php/conexao.php');
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

function somente_digitos($valor){
	return preg_replace('/\D/', '', (string)$valor);
}

function email_valido($email){
	return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

if(isset($_POST['nome'], $_POST['email'], $_POST['senha'], $_POST['cpf'], $_POST['celular'], $_POST['telefone'], $_POST['turma_id'])){
	$nome = trim($_POST['nome'] ?? '');
	$email = trim($_POST['email'] ?? '');
	$senha = trim($_POST['senha'] ?? '');
	$cpf = somente_digitos($_POST['cpf'] ?? '');
	$celular = somente_digitos($_POST['celular'] ?? '');
	$telefone = somente_digitos($_POST['telefone'] ?? '');
	$turma_id = (int)$_POST['turma_id'];
	$erro = '';
	if($nome === '' || $email === '' || $senha === '' || $cpf === '' || $celular === '' || $turma_id <= 0){
		$erro = 'Preencha todos os campos obrigatorios. Telefone e opcional.';
	}else if(!email_valido($email)){
		$erro = 'Informe um e-mail valido.';
	}else if(strlen($cpf) != 11){
		$erro = 'CPF invalido. Informe 11 digitos.';
	}else if(strlen($celular) < 10 || strlen($celular) > 11){
		$erro = 'Celular invalido. Informe 10 ou 11 digitos.';
	}else if($telefone !== '' && (strlen($telefone) < 10 || strlen($telefone) > 11)){
		$erro = 'Telefone invalido. Informe 10 ou 11 digitos.';
	}else if($turma_id <= 0){
		$erro = 'Selecione uma turma valida.';
	}

	if($erro !== ''){
		$retorno = ['status' => 'nok', 'mensagem' => $erro, 'data' => []];
	}else{
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
	}
}else{
	$retorno = ['status' => 'nok', 'mensagem' => 'Dados incompletos para inclusao.', 'data' => []];
}

$conexao->close();
header("Content-type:application/json;charset:utf-8");
echo json_encode($retorno);
