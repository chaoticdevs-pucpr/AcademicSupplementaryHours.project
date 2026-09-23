<?php
use PHPUnit\Framework\TestCase;

// Caminho relativo correto para a função dentro de ash/pages/inc/
require_once __DIR__ . '/../ash/pages/inc/hc_calculos.php';

// O nome da classe DEVE ser idêntico ao nome do arquivo para o PHPUnit encontrar
class teste_calculos_hc extends TestCase
{
    public function testCalculoHoraExcedenteDeveriaBarrar(): void
    {
        $subcategoria = [
            'tipo_calculo'     => 'HORA',
            'valor_referencia' => 1,
            'quant_pontos'     => 1
        ];

        $dados = [
            'horas_brutas' => 10000
        ];

        // Requisito da planilha: o teste espera que uma exceção seja disparada
        $this->expectException(Exception::class);

        calcular_pontos($subcategoria, $dados);
    }
}