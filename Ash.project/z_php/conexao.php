<?php
// Variáveis de conexão com o Banco de Dados
$servidor = "localhost:3307";
$usuario  = "root";
$senha    = "sedrftgyhujinj252242!*";
$nome_banco = "ash_project";

$conexao = new mysqli($servidor, $usuario, $senha, $nome_banco);
if($conexao->connect_error){
    echo $conexao->connect_error;
}