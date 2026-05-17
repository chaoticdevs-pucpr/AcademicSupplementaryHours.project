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
});

async function carregarSubcategoria(id){
    try {
        const resposta = await fetch(`../php/config_hc_subcategorias.php?subcategoria_id=${encodeURIComponent(id)}`);
        const dados = await resposta.json();
        if(dados.status === 'ok' && dados.data.length > 0){
            const sub = dados.data[0];
            document.getElementById('subcategoria_nome').value = sub.nome;
            document.getElementById('subcategoria_horas').value = sub.quant_pontos;
            document.getElementById('subcategoria_descricao').value = sub.descricao || '';
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
