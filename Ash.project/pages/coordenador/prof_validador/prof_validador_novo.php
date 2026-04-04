<?php
include_once('../../../z_php/conexao.php');
session_start();

$retorno = [
	'status' => '',
	'mensagem' => '',
	'data' => []
];

if(!isset($_SESSION['usuario']) || $_SESSION['usuario']['perfil'] != 'COORDENADOR'){
	$retorno = [
		'status' => 'nok',
		'mensagem' => 'Sem permissao.',
		'data' => []
	];
	header("Content-type:application/json;charset:utf-8");
	echo json_encode($retorno);
	exit;
}

if(isset($_POST['nome'])){
	$nome = $_POST['nome'];
	$email = $_POST['email'];
	$senha = $_POST['senha'];
	$cpf = $_POST['cpf'];
	$celular = $_POST['celular'];
	$telefone = $_POST['telefone'];
	$curso_id = (int)$_POST['curso_id'];
	$admin_id = (int)$_SESSION['usuario']['id'];

	$stmt = $conexao->prepare("INSERT INTO USUARIO(email, senha, perfil) VALUES(?, ?, 'PROFESSOR')");
	$stmt->bind_param("ss", $email, $senha);
	$stmt->execute();

	if($stmt->affected_rows > 0){
		$usuario_id = $conexao->insert_id;
		$stmt->close();

		$stmt = $conexao->prepare("INSERT INTO PROF_VALIDADOR(usuario_id, curso_id, nome, cpf, celular, telefone, cadastrado_por_admin_id) VALUES(?,?,?,?,?,?,?)");
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
}else{
	$retorno = ['status' => 'nok', 'mensagem' => 'Dados incompletos para inclusao.', 'data' => []];
}

$conexao->close();
header("Content-type:application/json;charset:utf-8");
echo json_encode($retorno);
