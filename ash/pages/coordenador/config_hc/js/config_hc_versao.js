document.addEventListener("DOMContentLoaded", () => {
    valida_sessao('COORDENADOR');

    const url = new URLSearchParams(window.location.search);
    const versao = url.get('versao');
    if(!versao){
        alert('Versão não informada.');
        window.location.href = '../config_hc_index.html';
        return;
    }

    document.getElementById('versaoLabel').textContent = versao;
    document.getElementById('btnNovo').href = `config_hc_categoria_novo.html?versao=${encodeURIComponent(versao)}`;
    buscar(versao);

    const btnLogoff = document.getElementById('logoff');
    if(btnLogoff){
        btnLogoff.addEventListener('click', () => { logoff(); });
    }
});

async function logoff(){
    try {
        const retorno = await fetch("../../../../z_login/logoff.php");
        const resposta = await retorno.json();
        if(resposta.status == 'ok'){
            window.location.href = "../../../../z_login/";
        }
    } catch(e) {
        console.error('Erro no logoff:', e);
    }
}

async function buscar(versao){
    try {
        const retorno = await fetch(`../php/config_hc_categorias.php?versao=${encodeURIComponent(versao)}`);
        const resposta = await retorno.json();
        if(resposta.status == 'ok'){
            preencherTabela(resposta.data, versao);
        } else {
            preencherTabela([], versao);
        }
    } catch (e) {
        console.error('Erro ao buscar categorias:', e);
        preencherTabela([], versao);
    }
}

async function excluir(id){
    if(confirm('Tem certeza que deseja excluir esta categoria?')){
        try {
            const retorno = await fetch(`../php/config_hc_categoria_excluir.php?id=${id}`);
            const resposta = await retorno.json();
            if(resposta.status == 'ok'){
                alert('SUCESSO: ' + resposta.mensagem);
                const url = new URLSearchParams(window.location.search);
                buscar(url.get('versao'));
            } else {
                alert('ERRO: ' + resposta.mensagem);
            }
        } catch(e){
            console.error('Erro ao excluir:', e);
            alert('Erro de comunicação com o servidor.');
        }
    }
}

function preencherTabela(tabela, versao){
    let html = `
    <div class="overflow-x-auto shadow-sm ring-1 ring-slate-200 rounded-xl bg-white">
            <table class="w-full text-left border-collapse min-w-[760px] text-sm">
            <thead class="bg-slate-50 border-b border-slate-200">
                <tr>
                        <th class="px-4 py-3 sm:px-6 sm:py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">ID</th>
                        <th class="px-4 py-3 sm:px-6 sm:py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Versão</th>
                        <th class="px-4 py-3 sm:px-6 sm:py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Categoria</th>
                        <th class="px-4 py-3 sm:px-6 sm:py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Subcategoria</th>
                        <th class="px-4 py-3 sm:px-6 sm:py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tipo</th>
                        <th class="px-4 py-3 sm:px-6 sm:py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Ações</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 bg-white">`;

    if(!tabela || tabela.length === 0){
        html += `
        <tr>
            <td colspan="4" class="py-12 text-center text-slate-500 text-sm">
                Nenhuma categoria cadastrada para esta versão.
            </td>
        </tr>`;
    } else {
        for(const item of tabela){
            html += `
            <tr class="hover:bg-slate-50 transition-colors">
                    <td class="px-4 py-3 sm:px-6 sm:py-4 text-sm font-medium text-slate-400">${item.id}</td>
                    <td class="px-4 py-3 sm:px-6 sm:py-4 break-words">
                    <div class="text-sm font-medium text-slate-900">${item.nome}</div>
                    <div class="text-xs text-slate-500 mt-1">${item.descricao || 'Sem descrição'}</div>
                </td>
                    <td class="px-4 py-3 sm:px-6 sm:py-4 text-sm text-slate-600 break-words">${item.categoria_nome}</td>
                    <td class="px-4 py-3 sm:px-6 sm:py-4 text-sm text-slate-600 break-words">${item.subcategoria_nome}</td>
                    <td class="px-4 py-3 sm:px-6 sm:py-4 text-sm text-slate-600">${item.tipo_calculo}</td>
                    <td class="px-4 py-3 sm:px-6 sm:py-4 text-right space-x-3 whitespace-nowrap">
                    <a href="config_hc_subcategorias.html?categoria_id=${item.id}&versao=${encodeURIComponent(versao)}" class="text-purple-600 hover:text-purple-900 text-sm font-bold transition-colors">Subcategorias</a>
                    <a href="config_hc_categoria_alterar.html?categoria_id=${item.id}&versao=${encodeURIComponent(versao)}" class="text-slate-600 hover:text-slate-900 text-sm font-bold transition-colors">Alterar</a>
                    <button onclick="excluir(${item.id})" class="text-red-500 hover:text-red-700 text-sm font-bold transition-colors">Excluir</button>
                </td>
            </tr>`;
       }
    }

    html += `</tbody></table></div>`;
    document.getElementById('lista').innerHTML = html;
}
