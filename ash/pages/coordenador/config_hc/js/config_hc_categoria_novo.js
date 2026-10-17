document.addEventListener('DOMContentLoaded', () => {
    valida_sessao('COORDENADOR');

    const params = new URLSearchParams(window.location.search);
    const versao = params.get('versao');
    if(!versao){
        alert('Versão não informada.');
        window.location.href = 'config_hc_index.html';
        return;
    }
    document.getElementById('versao').value = versao;
    document.getElementById('btnVoltar').href = `config_hc_versao.html?versao=${encodeURIComponent(versao)}`;

    document.getElementById('formCategoria').addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        formData.append('versao', versao);
        try {
            const resposta = await fetch('../php/config_hc_categoria_novo.php', {
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
            console.error('Erro ao gravar categoria', e);
            alert('Erro de comunicacao com o servidor.');
        }
    });
});
