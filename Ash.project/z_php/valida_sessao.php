<?php
session_start();
include_once('conexao.php');

$perfil = isset($_GET['perfil']) ? $_GET['perfil'] : '';

if(isset($_SESSION['usuario'])){
	if($perfil != '' && $_SESSION['usuario']['perfil'] != $perfil){
		$retorno = [
			'status'    => 'nok',
			'mensagem'  => 'Perfil sem permissao para a tela.',
			'data'      => []
		];
	}else if(isset($_SESSION['usuario']['status']) && $_SESSION['usuario']['status'] === 'INATIVO'){
		$retorno = [
			'status'    => 'nok',
			'mensagem'  => 'Usuario inativo.',
			'data'      => []
		];
	}else{
		$retorno = [
			'status'    => 'ok',
			'mensagem'  => '',
			'data'      => []
		];
	}
}else{
	$retorno = [
		'status'    => 'nok',
		'mensagem'  => 'Sessao expirada.',
		'data'      => []
	];
}

header("Content-type:application/json;charset:utf-8;");
echo json_encode($retorno);