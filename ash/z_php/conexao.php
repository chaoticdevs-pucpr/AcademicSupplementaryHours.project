
<?php
// Variáveis de conexão com o Banco de Dados
$servidor = "localhost:3306";
$usuario  = "root";
$senha    = "";
$nome_banco = "ash_project";

$conexao = new mysqli($servidor, $usuario, $senha, $nome_banco);
if($conexao->connect_error){
    echo $conexao->connect_error;
}
?> 

<!-- 
<?php
$servidor   = "sql113.infinityfree.com";
$usuario    = "if0_42949498";
$senha      = "ashPUCPR123";
$nome_banco = "if0_42949498_projeto ";

$conexao = new mysqli($servidor, $usuario, $senha, $nome_banco);

if ($conexao->connect_error) {
    die("Falha na ligação: " . $conexao->connect_error);
}
$conexao->set_charset("utf8mb4");
?> 
-->
