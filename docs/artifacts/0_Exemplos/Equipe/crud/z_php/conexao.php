<?php
$servidor = "localhost:";
$usuario = "root";
$senha = "sedrftgyhujinj252242!*";
$banco = "ash";

$conexao = new mysqli($servidor, $usuario, $senha, $banco);

if($conexao -> connect_error) {
    echo $conexao -> connect_error;
}
