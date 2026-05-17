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

    document.getElementById('btnNovo').href = `config_hc_subcategoria_novo.html?categoria_id=${encodeURIComponent(categoriaId)}&versao=${encodeURIComponent(versao)}`;
    document.getElementById('btnVoltar').href = `config_hc_versao.html?versao=${encodeURIComponent(versao)}`;
    document.getElementById('versaoLabel').textContent = versao;

    carregarCategoria(categoriaId);
    buscarSubcategorias(categoriaId);
});

async function carregarCategoria(categoriaId){
    try {
        const resposta = await fetch(`../php/config_hc_categorias.php?categoria_id=${encodeURIComponent(categoriaId)}`);
        const dados = await resposta.json();
        if(dados.status === 'ok' && dados.data.length > 0){
            document.getElementById('categoriaLabel').textContent = dados.data[0].nome;
        } else {
            alert('Categoria nao encontrada.');
            window.location.href = 'config_hc_index.html';
        }
    } catch (e) {
        console.error('Erro ao carregar categoria', e);
        alert('Erro de comunicacao com o servidor.');
        window.location.href = 'config_hc_index.html';
    }
}

async function buscarSubcategorias(categoriaId){
    try {
        const resposta = await fetch(`../php/config_hc_subcategorias.php?categoria_id=${encodeURIComponent(categoriaId)}`);
        const dados = await resposta.json();
        if(dados.status === 'ok'){
            preencherTabela(dados.data);
        } else {
            preencherTabela([]);
        }
    } catch (e) {
        console.error('Erro ao buscar subcategorias', e);
        preencherTabela([]);
    }
}

async function excluir(id){
    if(confirm('Tem certeza que deseja excluir esta subcategoria?')){
        try {
            const resposta = await fetch(`../php/config_hc_subcategoria_excluir.php?id=${id}`);
            const dados = await resposta.json();
            if(dados.status === 'ok'){
                alert(dados.mensagem);
                const params = new URLSearchParams(window.location.search);
                buscarSubcategorias(params.get('categoria_id'));
            } else {
                alert('Erro: ' + dados.mensagem);
            }
        } catch (e) {
            console.error('Erro ao excluir subcategoria', e);
            alert('Erro de comunicacao com o servidor.');
        }
    }
}

function preencherTabela(tabela){
    let html = `
    <div class="overflow-x-auto shadow-sm ring-1 ring-slate-200 rounded-xl bg-white">
        <table class="w-full text-left border-collapse min-w-[680px]">
            <thead class="bg-slate-50 border-b border-slate-200">
                <tr>
                    <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">ID</th>
                    <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Subcategoria</th>
                    <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Pontos</th>
                    <th class="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Ações</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 bg-white">`;

    if(!tabela || tabela.length === 0){
        html += `
        <tr>
            <td colspan="4" class="py-12 text-center text-slate-500 text-sm">Nenhuma subcategoria registrada nesta categoria.</td>
        </tr>`;
    } else {
        const params = new URLSearchParams(window.location.search);
        const categoriaId = params.get('categoria_id');
        const versao = params.get('versao');
        for(const item of tabela){
            html += `
            <tr class="hover:bg-slate-50 transition-colors">
                <td class="px-6 py-4 text-sm font-medium text-slate-400">${item.id}</td>
                <td class="px-6 py-4 text-sm text-slate-900">${item.nome}</td>
                <td class="px-6 py-4 text-sm text-slate-600">${item.quant_pontos || item.quant_horas} pts</td>
                <td class="px-6 py-4 text-right space-x-3 whitespace-nowrap">
                    <a href="config_hc_subcategoria_alterar.html?subcategoria_id=${item.id}&categoria_id=${encodeURIComponent(categoriaId)}&versao=${encodeURIComponent(versao)}" class="text-slate-600 hover:text-slate-900 text-sm font-bold">Alterar</a>
                    <button onclick="excluir(${item.id})" class="text-red-500 hover:text-red-700 text-sm font-bold">Excluir</button>
                </td>
            </tr>`;
        }
    }

    html += `</tbody></table></div>`;
    document.getElementById('lista').innerHTML = html;
}
