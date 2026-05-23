<?php

// 'val' converte o dado para o tipo à esquerda
// strtoupper só transforma o texto em maiúsculo
// floor arredonda o número: (3.2) = 3

function calcular_pontos(array $subcategoria, array $dados): array {
    $tipo = strtoupper(trim($subcategoria['tipo_calculo'] ?? 'FIXO'));
    $unidade = strtoupper(trim($subcategoria['unidade_referencia'] ?? 'PONTO'));
    $valorRef = floatval($subcategoria['valor_referencia'] ?? 1);
    $qPontos = floatval($subcategoria['quant_pontos'] ?? 0);

    $horas = isset($dados['horas_brutas']) ? floatval($dados['horas_brutas']) : null;
    $duracao_meses = isset($dados['duracao_meses']) ? intval($dados['duracao_meses']) : null;
    $duracao_semestres = isset($dados['duracao_semestres']) ? intval($dados['duracao_semestres']) : null;
    $detalhes = [];
    $pontos = 0.0;

    switch($tipo){
        case 'HORA':
            if($horas === null){
                $detalhes[] = 'Horas não informadas.';
            } else {
                if($valorRef <= 0) $valorRef = 1;
                $units = floor($horas / $valorRef);
                $pontos = $units * $qPontos;
                $detalhes[] = "Horas: {$horas} / {$valorRef} => unidades={$units} => pontos={$pontos}";
            }
            break;
        case 'PERIODO':
            // unidade normalmente MES, valor_ref = meses por unidade (ex: 6 meses)
            if($duracao_meses !== null){
                $units = floor($duracao_meses / max(1, intval($valorRef)));
                $pontos = $units * $qPontos;
                $detalhes[] = "Período (meses): {$duracao_meses} / {$valorRef} => unidades={$units} => pontos={$pontos}";
            } else if($horas !== null){
                // 1 mês = 160 horas
                $meses = floor($horas / 160);
                $units = floor($meses / max(1, intval($valorRef)));
                $pontos = $units * $qPontos;
                $detalhes[] = "Fallback: horas {$horas} → meses≈{$meses}; unidades={$units} → pontos={$pontos}";
            } else {
                $detalhes[] = 'Duração em meses não informada.';
            }
            break;
        case 'ANO':
            if($duracao_semestres !== null){
                // semestre como metade de ano
                $anos = floor($duracao_semestres / 2);
                $units = floor($anos / max(1, intval($valorRef)));
                $pontos = $units * $qPontos;
                $detalhes[] = "Semestres: {$duracao_semestres} => anos={$anos} => unidades={$units} => pontos={$pontos}";
            } else if($horas !== null){
                $anos = floor($horas / (160 * 12));
                $units = floor($anos / max(1, intval($valorRef)));
                $pontos = $units * $qPontos;
                $detalhes[] = "Fallback: horas {$horas} → anos≈{$anos}; unidades={$units} → pontos={$pontos}";
            } else {
                $detalhes[] = 'Duração em anos/semestres não informada.';
            }
            break;
        case 'SEMESTRE':
            if($duracao_semestres !== null){
                $units = floor($duracao_semestres / max(1, intval($valorRef)));
                $pontos = $units * $qPontos;
                $detalhes[] = "Semestres: {$duracao_semestres} / {$valorRef} => unidades={$units} => pontos={$pontos}";
            } else if($horas !== null){
                // 1 semestre é aproximado como 6 meses no fallback
                $semestres = floor($horas / (160 * 6));
                $units = floor($semestres / max(1, intval($valorRef)));
                $pontos = $units * $qPontos;
                $detalhes[] = "Fallback: horas {$horas} → semestres≈{$semestres}; unidades={$units} → pontos={$pontos}";
            } else {
                $detalhes[] = 'Duração em semestres não informada.';
            }
            break;
        case 'FIXO':
        default:
            $pontos = $qPontos;
            $detalhes[] = "Padrão FIXO: {$pontos} pontos";
            break;
    }
// Lembrando que retorna como Array
    return [
        'pontos' => floatval($pontos),
        'detalhes' => $detalhes,
        'tipo' => $tipo,
        'unidade' => $unidade,
        'valor_referencia' => $valorRef
    ];
}

?>
