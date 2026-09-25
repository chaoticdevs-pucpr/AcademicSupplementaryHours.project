<?php
use PHPUnit\Framework\TestCase;

require_once __DIR__ . '/../ash/pages/inc/hc_calculos.php';

class teste_calculos_hc extends TestCase
{
    /**
     * ID 12: teste com carga horária excedente ao limite
     */
    public function testCalculoHoraExcedente(): void
    {
        $subcategoria = [
            'tipo_calculo'     => 'HORA',
            'valor_referencia' => 1,
            'quant_pontos'     => 1
        ];

        $dados = [
            'horas_brutas' => 10000
        ];

        $this->expectException(Exception::class);

        calcular_pontos($subcategoria, $dados);
    }

    /**
     * ID 11: fluxo normal
     */
    public function testCalculoHoraNormal(): void
    {
        $subcategoria = [
            'tipo_calculo'     => 'HORA',
            'valor_referencia' => 1,
            'quant_pontos'     => 1
        ];

        $dados = [
            'horas_brutas' => 20
        ];

        $resultado = calcular_pontos($subcategoria, $dados);

        $this->assertEquals(20.0, $resultado['pontos']);
    }

    /**
     * Teste de Caixa Branca - Entrada Inválida (Horas Negativas)
     */
    public function testCalculoHoraValorNegativo(): void
    {
        $subcategoria = [
            'tipo_calculo'     => 'HORA',
            'valor_referencia' => 1,
            'quant_pontos'     => 1
        ];

        $dados = [
            'horas_brutas' => -15
        ];

        $resultado = calcular_pontos($subcategoria, $dados);

        $this->assertGreaterThanOrEqual(0.0, $resultado['pontos'], 'A função permitiu gerar pontuação negativa.');
    }
}