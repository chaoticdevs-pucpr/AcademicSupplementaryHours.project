<?php
use PHPUnit\Framework\TestCase;

require_once __DIR__ . '/../ash/pages/inc/hc_calculos.php';


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


        $this->expectException(Exception::class);

        calcular_pontos($subcategoria, $dados);
    }
}