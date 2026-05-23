document.addEventListener('DOMContentLoaded', () => {
    valida_sessao('COORDENADOR');

    const params = new URLSearchParams(window.location.search);
    const subcategoriaId = params.get('subcategoria_id');
    const categoriaId = params.get('categoria_id');
    const versao = params.get('versao');

    if(!subcategoriaId || !categoriaId || !versao){
        alert('Dados insuficientes para alterar a subcategoria.');
        window.location.href = 'config_hc_index.html';
        return;
    }

    document.getElementById('categoria_id').value = categoriaId;
    document.getElementById('versao').value = versao;
    document.getElementById('btnVoltar').href = `config_hc_subcategorias.html?categoria_id=${encodeURIComponent(categoriaId)}&versao=${encodeURIComponent(versao)}`;

    carregarSubcategoria(subcategoriaId);

    document.getElementById('formSubcategoria').addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        try {
            const resposta = await fetch(`../php/config_hc_subcategoria_alterar.php?id=${encodeURIComponent(subcategoriaId)}`, {
                method: 'POST',
                body: formData
            });
            const dados = await resposta.json();
            if(dados.status === 'ok'){
                alert(dados.mensagem);
                window.location.href = `config_hc_subcategorias.html?categoria_id=${encodeURIComponent(categoriaId)}&versao=${encodeURIComponent(versao)}`;
            } else {
                alert('Erro: ' + dados.mensagem);
            }
        } catch (e) {
            console.error('Erro ao alterar subcategoria', e);
            alert('Erro de comunicacao com o servidor.');
        }
    });

    function updateVisibility(){
        const tipo = (document.getElementById('tipo_calculo').value || 'FIXO').toUpperCase();
        const divUn = document.getElementById('div_unidade');
        const divVal = document.getElementById('div_valor');
        if(tipo === 'FIXO'){
            if(divUn) divUn.style.display = 'none';
            if(divVal) divVal.style.display = 'none';
        } else {
            if(divUn) divUn.style.display = '';
            if(divVal) divVal.style.display = '';
        }
    }
    document.getElementById('tipo_calculo').addEventListener('change', updateVisibility);
    
    function updateRegra(){
        const tipo = (document.getElementById('tipo_calculo').value || 'FIXO').toUpperCase();
        const unidade = document.getElementById('unidade_referencia')?.value || '';
        const valor = document.getElementById('valor_referencia')?.value || '';
        const pontos = document.getElementById('subcategoria_horas')?.value || '';
        const preview = document.getElementById('regra_preview_coordenador');
        if(!preview) return;
        let texto = '';
        if(tipo === 'FIXO'){
            texto = `Regra: FIXO — ${pontos || 0} pontos por solicitação.`;
        } else if(tipo === 'HORA'){
            texto = `Regra: HORA — ${pontos || 0} ponto(s) a cada ${valor || 1} ${unidade || 'horas'}.`;
        } else if(tipo === 'PERIODO'){
            texto = `Regra: PERIODO — ${pontos || 0} ponto(s) por ${valor || 1} ${unidade || 'período(s)'} (converte horas → meses).`;
        } else if(tipo === 'ANO'){
            texto = `Regra: ANO — ${pontos || 0} ponto(s) a cada ${valor || 1} ano(s).`;
        } else if(tipo === 'SEMESTRE'){
            texto = `Regra: SEMESTRE — ${pontos || 0} ponto(s) a cada ${valor || 1} semestre(s).`;
        } else {
            texto = `Regra: ${tipo} — ${pontos || 0} pontos.`;
        }
        preview.textContent = texto;
    }
    ['tipo_calculo','unidade_referencia','valor_referencia','subcategoria_horas'].forEach(id => {
        const el = document.getElementById(id);
        if(el) el.addEventListener('input', updateRegra);
    });
});

async function carregarSubcategoria(id){
    try {
        const resposta = await fetch(`../php/config_hc_subcategorias.php?subcategoria_id=${encodeURIComponent(id)}`);
        const dados = await resposta.json();
        if(dados.status === 'ok' && dados.data.length > 0){
            const sub = dados.data[0];
            document.getElementById('subcategoria_nome').value = sub.nome;
            document.getElementById('subcategoria_horas').value = sub.quant_pontos;
            document.getElementById('tipo_calculo').value = sub.tipo_calculo || 'FIXO';
            document.getElementById('unidade_referencia').value = sub.unidade_referencia || 'PONTO';
            document.getElementById('valor_referencia').value = sub.valor_referencia || 1;
            document.getElementById('subcategoria_descricao').value = sub.descricao || '';
            if(typeof updateVisibility === 'function') updateVisibility();
            if(typeof updateRegra === 'function') updateRegra();
        } else {
            alert('Subcategoria nao encontrada.');
            window.history.back();
        }
    } catch (e) {
        console.error('Erro ao carregar subcategoria', e);
        alert('Erro de comunicacao com o servidor.');
        window.history.back();
    }
}
