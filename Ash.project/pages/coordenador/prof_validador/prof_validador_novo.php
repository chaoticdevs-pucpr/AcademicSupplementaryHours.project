<?php
include_once('../../../z_php/conexao.php');
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
	$coord_id = (int)$_SESSION['usuario']['id'];

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

	$stmtCurso = $conexao->prepare("SELECT curso_id FROM COORDENADOR WHERE usuario_id = ?");
	$stmtCurso->bind_param("i", $coord_id);
	$stmtCurso->execute();
	$resCurso = $stmtCurso->get_result();

	if($resCurso->num_rows == 0){
		$retorno = ['status' => 'nok', 'mensagem' => 'Coordenador sem curso vinculado.', 'data' => []];
	}else{
		$curso = $resCurso->fetch_assoc();
		$curso_id = (int)$curso['curso_id'];
		$stmtCurso->close();

		$stmtTurma = $conexao->prepare("SELECT id FROM TURMA WHERE id = ? AND curso_id = ? AND prof_validador_id IS NULL");
		$stmtTurma->bind_param("ii", $turma_id, $curso_id);
		$stmtTurma->execute();
		$resTurma = $stmtTurma->get_result();

		if($resTurma->num_rows == 0){
			$retorno = ['status' => 'nok', 'mensagem' => 'Turma invalida ou ja vinculada a outro professor.', 'data' => []];
		}else{
			$stmtTurma->close();

			$stmt = $conexao->prepare("INSERT INTO USUARIO(email, senha, perfil) VALUES(?, ?, 'PROFESSOR')");
			$stmt->bind_param("ss", $email, $senha);
			$stmt->execute();
			if($stmt->affected_rows > 0){
				$usuario_id = $conexao->insert_id;
				$stmt->close();

				$stmt = $conexao->prepare("INSERT INTO PROF_VALIDADOR(usuario_id, nome, cpf, celular, telefone, cadastrado_por_coord_id) VALUES(?,?,?,?,?,?)");
				$stmt->bind_param("issssi", $usuario_id, $nome, $cpf, $celular, $telefone, $coord_id);
				$stmt->execute();

				if($stmt->affected_rows > 0){
					$stmt->close();

					$stmt = $conexao->prepare("UPDATE TURMA SET prof_validador_id = ? WHERE id = ? AND curso_id = ? AND prof_validador_id IS NULL");
					$stmt->bind_param("iii", $usuario_id, $turma_id, $curso_id);
					$stmt->execute();

					if($stmt->affected_rows > 0){
						$retorno = ['status' => 'ok', 'mensagem' => 'Registro inserido com sucesso.', 'data' => []];
					}else{
						$retorno = ['status' => 'nok', 'mensagem' => 'Falha ao vincular turma.', 'data' => []];
					}
				}else{
					$retorno = ['status' => 'nok', 'mensagem' => 'Falha ao inserir professor.', 'data' => []];
				}
			}else{
				$retorno = ['status' => 'nok', 'mensagem' => 'Falha ao inserir usuario.', 'data' => []];
			}
			$stmt->close();
		}
	}
	}
}else{
	$retorno = ['status' => 'nok', 'mensagem' => 'Dados incompletos para inclusao.', 'data' => []];
}

$conexao->close();
header("Content-type:application/json;charset:utf-8");
echo json_encode($retorno);
