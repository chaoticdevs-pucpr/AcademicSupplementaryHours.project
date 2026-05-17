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

    document.getElementById('versao').value = versao;
    document.getElementById('btnVoltar').href = `config_hc_versao.html?versao=${encodeURIComponent(versao)}`;

    carregarCategoria(categoriaId);

    document.getElementById('formCategoria').addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        try {
            const resposta = await fetch(`../php/config_hc_categoria_alterar.php?id=${encodeURIComponent(categoriaId)}`, {
                method: 'POST',
                body: formData
            });
            const dados = await resposta.json();
            if(dados.status === 'ok'){
                alert(dados.mensagem);
                window.location.href = `config_hc_versao.html?versao=${encodeURIComponent(versao)}`;
            } else {
                alert('Erro: ' + dados.mensagem);
            }
        } catch (e) {
            console.error('Erro ao alterar categoria', e);
            alert('Erro de comunicacao com o servidor.');
        }
    });
});

async function carregarCategoria(id){
    try {
        const resposta = await fetch(`../php/config_hc_categorias.php?categoria_id=${encodeURIComponent(id)}`);
        const dados = await resposta.json();
        if(dados.status === 'ok' && dados.data.length > 0){
            const categoria = dados.data[0];
            document.getElementById('categoria_nome').value = categoria.nome;
            document.getElementById('categoria_max').value = categoria.max_pontos;
        } else {
            alert('Categoria nao encontrada.');
            window.history.back();
        }
    } catch (e) {
        console.error('Erro ao carregar categoria', e);
        alert('Erro de comunicacao com o servidor.');
        window.history.back();
    }
}
