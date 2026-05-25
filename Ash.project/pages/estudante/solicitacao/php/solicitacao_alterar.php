<?php
include_once('../../../../z_php/conexao.php');
session_start();

$retorno = [
    'status'    => '',
    'mensagem'  => '',
    'data'      => []
];

if(!isset($_SESSION['usuario']) || $_SESSION['usuario']['perfil'] != 'ESTUDANTE'){
    $retorno = ['status' => 'nok', 'mensagem' => 'Sem permissao.', 'data' => []];
    header("Content-type:application/json;charset:utf-8");
    echo json_encode($retorno);
    exit;
}

$estudante_id = (int)$_SESSION['usuario']['id'];

$stmtMatricula = $conexao->prepare("SELECT m.id FROM MATRICULA m WHERE m.estudante_id = ? ORDER BY m.id LIMIT 1");
$stmtMatricula->bind_param("i", $estudante_id);
$stmtMatricula->execute();
$resMatricula = $stmtMatricula->get_result();

if($resMatricula->num_rows == 0){
    $retorno = ['status' => 'nok', 'mensagem' => 'Estudante sem matricula ativa.', 'data' => []];
    header("Content-type:application/json;charset:utf-8");
    echo json_encode($retorno);
    exit;
}

$matricula = $resMatricula->fetch_assoc();
$matricula_id = (int)$matricula['id'];
$stmtMatricula->close();

function normalizar_arquivos($campo){
    if(!isset($_FILES[$campo])){
        return [];
    }

    $arquivos = [];
    if(is_array($_FILES[$campo]['name'])){
        foreach($_FILES[$campo]['name'] as $indice => $nomeArquivo){
            if(($_FILES[$campo]['error'][$indice] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK){
                continue;
            }
            $arquivos[] = [
                'name' => $nomeArquivo,
                'tmp_name' => $_FILES[$campo]['tmp_name'][$indice],
                'error' => $_FILES[$campo]['error'][$indice]
            ];
        }
    } else if(($_FILES[$campo]['error'] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_OK){
        $arquivos[] = [
            'name' => $_FILES[$campo]['name'],
            'tmp_name' => $_FILES[$campo]['tmp_name'],
            'error' => $_FILES[$campo]['error']
        ];
    }

    return $arquivos;
}

function arquivo_permitido($tmp_name, $nomeArquivo){
    $allowMime = ['application/pdf', 'image/png', 'image/jpeg'];
    $allowExt = ['.pdf', '.png', '.jpg', '.jpeg'];

    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mime = $finfo ? finfo_file($finfo, $tmp_name) : '';
    if($finfo) finfo_close($finfo);

    $ext = strtolower(strrchr($nomeArquivo, '.')) ?: '';

    if(in_array($mime, $allowMime) && in_array($ext, $allowExt)){
        return true;
    }
    return false;
}

if(isset($_GET['id']) && isset($_POST['subcategoria_id'], $_POST['horas_brutas'], $_POST['justificativa'])){
    $id = (int)$_GET['id'];
    $subcategoria_id = (int)$_POST['subcategoria_id'];
    $horas_brutas = (float)$_POST['horas_brutas'];
    $justificativa = $_POST['justificativa'];
    $arquivosEnviados = normalizar_arquivos('arquivo');

    $stmtStatus = $conexao->prepare("SELECT status FROM SOLICITACAO WHERE id = ? AND matricula_id = ? LIMIT 1");
    $stmtStatus->bind_param("ii", $id, $matricula_id);
    $stmtStatus->execute();
    $resultadoStatus = $stmtStatus->get_result();

    if($resultadoStatus->num_rows == 0){
        $stmtStatus->close();
        $retorno = ['status' => 'nok', 'mensagem' => 'Solicitação não encontrada.', 'data' => []];
        header("Content-type:application/json;charset:utf-8");
        echo json_encode($retorno);
        exit;
    }

    $linhaStatus = $resultadoStatus->fetch_assoc();
    $stmtStatus->close();

    if(strtoupper($linhaStatus['status'] ?? '') !== 'PENDENTE'){
        $retorno = ['status' => 'nok', 'mensagem' => 'Solicitações aprovadas ou recusadas não podem ser alteradas.', 'data' => []];
        header("Content-type:application/json;charset:utf-8");
        echo json_encode($retorno);
        exit;
    }

    $stmtAnexos = $conexao->prepare("SELECT COUNT(*) AS total FROM ANEXO WHERE solicitacao_id = ?");
    $stmtAnexos->bind_param("i", $id);
    $stmtAnexos->execute();
    $resultadoAnexos = $stmtAnexos->get_result();
    $linhaAnexos = $resultadoAnexos->fetch_assoc();
    $totalAnexosAtuais = (int)($linhaAnexos['total'] ?? 0);
    $stmtAnexos->close();

    if(($totalAnexosAtuais + count($arquivosEnviados)) > 5){
        $retorno = ['status' => 'nok', 'mensagem' => 'Você pode ter no máximo 5 anexos por solicitação.', 'data' => []];
        header("Content-type:application/json;charset:utf-8");
        echo json_encode($retorno);
        exit;
    }

    // Validar tipos de todos os arquivos antes de alterar a solicitação
    if(count($arquivosEnviados) > 0){
        foreach($arquivosEnviados as $arquivo){
            if(!arquivo_permitido($arquivo['tmp_name'], $arquivo['name'])){
                $retorno = ['status' => 'nok', 'mensagem' => 'Tipo de arquivo não permitido. Apenas PDF, PNG e JPG são aceitos.', 'data' => []];
                header("Content-type:application/json;charset:utf-8");
                echo json_encode($retorno);
                exit;
            }
        }
    }

    $stmt = $conexao->prepare("UPDATE SOLICITACAO SET subcategoria_id = ?, horas_brutas = ?, justificativa = ? WHERE id = ? AND matricula_id = ? AND status = 'PENDENTE'");
    $stmt->bind_param("idsii", $subcategoria_id, $horas_brutas, $justificativa, $id, $matricula_id);
    $stmt->execute();

    // Mesmo que affected_rows seja 0 (nenhuma coluna alterada), consideramos a operação OK se não houve erro
    if($stmt->errno === 0){
        $retorno = ['status' => 'ok', 'mensagem' => 'Registro alterado com sucesso.', 'data' => []];
    } else {
        $retorno = ['status' => 'nok', 'mensagem' => 'Nao foi possivel alterar.', 'data' => []];
    }

    $stmt->close();

    if($retorno['status'] == 'ok' && count($arquivosEnviados) > 0){
        $pastaUploads = '../../uploads';

        if(!is_dir($pastaUploads)){
            mkdir($pastaUploads, 0777, true);
        }

        foreach($arquivosEnviados as $indice => $arquivo){
            // Validar tipo de arquivo
            if(!arquivo_permitido($arquivo['tmp_name'], $arquivo['name'])){
                $retorno = ['status' => 'nok', 'mensagem' => 'Tipo de arquivo não permitido. Apenas PDF, PNG e JPG são aceitos.', 'data' => []];
                header("Content-type:application/json;charset:utf-8");
                echo json_encode($retorno);
                exit;
            }
            $nomeArquivo = basename($arquivo['name']);
            $nomeDestino = 'solicitacao_' . $id . '_' . ($indice + 1) . '_' . preg_replace('/[^a-zA-Z0-9_.-]/', '_', $nomeArquivo);
            $caminhoFisico = $pastaUploads . '/' . $nomeDestino;
            $caminhoBanco = 'uploads/' . $nomeDestino;

            if(move_uploaded_file($arquivo['tmp_name'], $caminhoFisico)){
                $stmt = $conexao->prepare("INSERT INTO ANEXO(solicitacao_id, caminho_arquivo) VALUES(?, ?)");
                $stmt->bind_param("is", $id, $caminhoBanco);
                $stmt->execute();
                $stmt->close();
            }
        }
    }
}else{
    $retorno = ['status' => 'nok', 'mensagem' => 'Nao posso alterar sem informar ID.', 'data' => []];
}

$conexao->close();

header("Content-type:application/json;charset:utf-8");
echo json_encode($retorno);
