<?php
include_once('../../../../z_php/conexao.php');
session_start();

$retorno = [
	'status' => '',
	'mensagem' => '',
	'data' => []
];

if(!isset($_SESSION['usuario']) || $_SESSION['usuario']['perfil'] != 'ADMIN'){
	$retorno = [
		'status' => 'nok',
		'mensagem' => 'Sem permissao.',
		'data' => []
	];
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

if(isset($_POST['nome'])){
	$nome = trim($_POST['nome'] ?? '');
	$email = trim($_POST['email'] ?? '');
	$senha = trim($_POST['senha'] ?? '');
	$cpf = somente_digitos($_POST['cpf'] ?? '');
	$celular = somente_digitos($_POST['celular'] ?? '');
	$telefone = somente_digitos($_POST['telefone'] ?? '');
	$curso_id = (int)$_POST['curso_id'];
	$admin_id = (int)$_SESSION['usuario']['id'];

	if($nome === '' || $email === '' || $senha === '' || $cpf === '' || $celular === '' || $curso_id <= 0){
		$retorno = ['status' => 'nok', 'mensagem' => 'Preencha todos os campos obrigatorios. Telefone e opcional.', 'data' => []];
	}else if(!email_valido($email)){
		$retorno = ['status' => 'nok', 'mensagem' => 'Informe um e-mail valido.', 'data' => []];
	}else if(strlen($cpf) != 11){
		$retorno = ['status' => 'nok', 'mensagem' => 'CPF invalido. Informe 11 digitos.', 'data' => []];
	}else if(strlen($celular) < 10 || strlen($celular) > 11){
		$retorno = ['status' => 'nok', 'mensagem' => 'Celular invalido. Informe 10 ou 11 digitos.', 'data' => []];
	}else if($telefone !== '' && (strlen($telefone) < 10 || strlen($telefone) > 11)){
		$retorno = ['status' => 'nok', 'mensagem' => 'Telefone invalido. Informe 10 ou 11 digitos.', 'data' => []];
	}else{

		$stmt = $conexao->prepare("INSERT INTO USUARIO(email, senha, perfil) VALUES(?, ?, 'COORDENADOR')");
		$stmt->bind_param("ss", $email, $senha);
		$stmt->execute();

		if($stmt->affected_rows > 0){
			$usuario_id = $conexao->insert_id;
			$stmt->close();

			$stmt = $conexao->prepare("INSERT INTO COORDENADOR(usuario_id, curso_id, nome, cpf, celular, telefone, cadastrado_por_admin_id) VALUES(?,?,?,?,?,?,?)");
			$stmt->bind_param("iissssi", $usuario_id, $curso_id, $nome, $cpf, $celular, $telefone, $admin_id);
			$stmt->execute();

			if($stmt->affected_rows > 0){
				$retorno = [
					'status' => 'ok',
					'mensagem' => 'Registro inserido com sucesso.',
					'data' => []
				];
			}else{
				$retorno = [
					'status' => 'nok',
					'mensagem' => 'Falha ao inserir coordenador.',
					'data' => []
				];
			}
		}else{
			$retorno = [
				'status' => 'nok',
				'mensagem' => 'Falha ao inserir usuario.',
				'data' => []
			];
		}
		$stmt->close();
	}
}else{
	$retorno = ['status' => 'nok', 'mensagem' => 'Dados incompletos para inclusao.', 'data' => []];
}

$conexao->close();
header("Content-type:application/json;charset:utf-8");
echo json_encode($retorno);
