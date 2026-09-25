<?php
use PHPUnit\Framework\TestCase;

require_once __DIR__ . '/hc_calculos_mutante1.php';
require_once __DIR__ . '/hc_calculos_mutante2.php';

class MutacaoTest extends TestCase
{
    /**
     * Avalia o Mutante 1 (troca de divisão por multiplicação)
     * Entrada: 20 horas, valor_referencia = 2.
     * Esperado pela regra correta: 10.0 pontos.
     * O código mutante calcula: 40.0 pontos.
     */
    public function testMutante1_OperadorAritmetico(): void
    {
        $subcategoria = [
            'tipo_calculo'     => 'HORA',
            'valor_referencia' => 2,
            'quant_pontos'     => 1
        ];

        $dados = ['horas_brutas' => 20];

        $resultado = calcular_pontos_m1($subcategoria, $dados);

        // O PHPUnit vai acusar erro porque 40.0 != 10.0 (Mutante Morto com sucesso)
        $this->assertEquals(10.0, $resultado['pontos']);
    }

    /**
     * Avalia o Mutante 2 (troca de floor por ceil)
     * Entrada: 15 horas, valor_referencia = 10.
     * Esperado pela regra correta: 1.0 ponto (apenas 1 bloco fechado).
     * O código mutante calcula: 2.0 pontos (arredonda fração para cima).
     */
    public function testMutante2_ArredondamentoIndevido(): void
    {
        $subcategoria = [
            'tipo_calculo'     => 'HORA',
            'valor_referencia' => 10,
            'quant_pontos'     => 1
        ];

        $dados = ['horas_brutas' => 15];

        $resultado = calcular_pontos_m2($subcategoria, $dados);

        // O PHPUnit vai acusar erro porque 2.0 != 1.0 (Mutante Morto com sucesso)
        $this->assertEquals(1.0, $resultado['pontos']);
    }
}