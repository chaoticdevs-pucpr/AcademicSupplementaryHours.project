document.addEventListener("DOMContentLoaded", () => {
    valida_sessao();

    const btnSolicitacoes = document.getElementById("solicitacoes");
    if (btnSolicitacoes) {
        btnSolicitacoes.addEventListener("click", () => {
            window.location.href = 'solicitacao/solicitacao_index.html';
        });
    }

    const btnLogoff = document.getElementById("logoff");
    if (btnLogoff) {
        btnLogoff.addEventListener("click", () => {
            logoff();
        });
    }

    carregarResumoEstudante();
});

async function carregarResumoEstudante(){
    try {
        const retorno = await fetch("php/estudante_resumo.php");
        const resposta = await retorno.json();

        if(resposta.status !== 'ok'){
            console.error('Erro ao carregar resumo do estudante:', resposta.mensagem);
            renderCategorias([], []);
            return;
        }

        const data = resposta.data || {};
        const nome = data.nome_usuario || 'Estudante';
        const totalAprovado = parseFloat(data.total_aprovado || 0);
        const horasObjetivo = parseFloat(data.horas_objetivo || 0);
        const percentual = parseFloat(data.percentual || 0);

        document.getElementById('user-name').textContent = nome;
        document.getElementById('hours-done').textContent = formatNumber(totalAprovado);
        document.getElementById('hours-target').textContent = formatNumber(horasObjetivo);
        document.getElementById('main-percentage').textContent = `${formatNumber(percentual)}%`;

        atualizarProgressCircle(percentual);
        renderCategorias(data.categorias || [], data.subcategorias || []);
    } catch(error) {
        console.error('Falha ao carregar resumo do estudante:', error);
        renderCategorias([], []);
    }
}

function formatNumber(valor){
    const numero = Number(valor || 0);
    if(Number.isNaN(numero)) return '0';
    return Number.isInteger(numero) ? numero.toString() : numero.toFixed(2);
}

function atualizarProgressCircle(percentual){
    const circle = document.getElementById('progress-circle');
    if(!circle) return;

    const radius = 88;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (circumference * Math.min(Math.max(percentual, 0), 100) / 100);

    circle.style.strokeDasharray = circumference.toString();
    circle.style.strokeDashoffset = offset.toString();
}

function renderCategorias(categorias, subcategorias){
    const container = document.getElementById('categories-container');
    if(!container) return;

    if(!Array.isArray(categorias) || categorias.length === 0){
        container.innerHTML = `
            <div class="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 text-slate-500">
                <p>Sem categorias encontradas para o seu curso ou nenhuma hora aprovada ainda.</p>
            </div>
        `;
        return;
    }

    const subPorCategoria = {};
    (subcategorias || []).forEach(sub => {
        const categoriaId = sub.categoria_id;
        if(!subPorCategoria[categoriaId]) subPorCategoria[categoriaId] = [];
        subPorCategoria[categoriaId].push(sub);
    });

    const html = categorias.map(cat => {
        const total = formatNumber(parseFloat(cat.total_horas || 0));
        const max = formatNumber(parseFloat(cat.max_pontos || 0));
        const hasLimit = Number(cat.max_pontos) > 0;
        const subHtml = (subPorCategoria[cat.categoria_id] || []).map(sub => {
            const totalSub = formatNumber(parseFloat(sub.total_horas || 0));
            const pendentes = parseInt(sub.total_solicitacoes || 0, 10);
            return `
                <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-sm border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
                    <span class="text-slate-600">${sub.subcategoria_nome || 'Subcategoria'}</span>
                    <div class="flex flex-wrap items-center gap-3">
                        <span class="font-semibold text-slate-900">${totalSub}h</span>
                        ${pendentes > 0 ? `<span class="inline-flex items-center rounded-full bg-amber-100 text-amber-800 px-2.5 py-1 text-[11px] font-semibold">Pendente: ${pendentes}</span>` : ''}
                    </div>
                </div>
            `;
        }).join('');

        return `
            <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <details class="group">
                    <summary class="flex items-center justify-between p-5 cursor-pointer list-none hover:bg-slate-50 transition-colors">
                        <div class="flex items-center gap-4">
                            <div class="bg-indigo-100 text-indigo-600 p-2 rounded-lg">
                                <i data-lucide="clipboard-list" class="w-5 h-5"></i>
                            </div>
                            <div>
                                <span class="font-bold text-slate-700">${cat.categoria_nome}</span>
                                <p class="text-xs text-slate-400">${hasLimit ? `Limite: ${max}h` : 'Sem limite definido'}</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-4">
                            <span class="text-sm font-bold text-slate-900">${total}h${hasLimit ? ` / ${max}h` : ''}</span>
                            <i data-lucide="chevron-down" class="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform"></i>
                        </div>
                    </summary>
                    <div class="px-5 pb-5 border-t border-slate-100 bg-slate-50/50">
                        ${subHtml || '<p class="text-slate-500 text-sm">Sem subcategorias com horas aprovadas ainda.</p>'}
                    </div>
                </details>
            </div>
        `;
    }).join('');

    container.innerHTML = html;
    if (window.lucide) {
        lucide.createIcons();
    }
}

async function logoff(){
    const retorno = await fetch("../../z_login/logoff.php");
    const resposta = await retorno.json();
    if(resposta.status == "ok"){
        window.location.href = "../../z_login/";
    }
}
