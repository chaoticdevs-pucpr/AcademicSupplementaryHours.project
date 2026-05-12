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
});
