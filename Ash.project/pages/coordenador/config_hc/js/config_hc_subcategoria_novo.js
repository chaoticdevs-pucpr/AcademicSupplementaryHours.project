document.addEventListener('DOMContentLoaded', () => {
    valida_sessao('COORDENADOR');

    const params = new URLSearchParams(window.location.search);
    const categoriaId = params.get('categoria_id');
    const versao = params.get('versao');
    if(!categoriaId || !versao){
        alert('Categoria ou versão não informada.');
        window.location.href = 'config_hc_index.html';
        return;
    }

    document.getElementById('categoria_id').value = categoriaId;
    document.getElementById('versao').value = versao;
    document.getElementById('btnVoltar').href = `config_hc_subcategorias.html?categoria_id=${encodeURIComponent(categoriaId)}&versao=${encodeURIComponent(versao)}`;

    document.getElementById('formSubcategoria').addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        formData.append('categoria_id', categoriaId);
        try {
            const resposta = await fetch('../php/config_hc_subcategoria_novo.php', {
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
        } catch(e){
            console.error('Erro ao gravar subcategoria', e);
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
    updateVisibility();

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
    updateRegra();
});
