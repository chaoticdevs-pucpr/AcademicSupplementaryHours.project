let solicitacoesCompletas = [];
let filtroAtualStatus = 'PENDENTE';

document.addEventListener("DOMContentLoaded", () => {
    valida_sessao('PROFESSOR');
    carregarSolicitacoes();
    configurarAbas();
});

function configurarAbas() {
    const btnLogoff = document.getElementById("logoff");
    if (btnLogoff) {
        btnLogoff.addEventListener("click", () => {
            logoff();
        });
    }

    document.getElementById("aba-pendentes").addEventListener("click", () => {
        filtroAtualStatus = 'PENDENTE';
        atualizarAbas();
        exibirSolicitacoes();
    });

    document.getElementById("aba-aprovadas").addEventListener("click", () => {
        filtroAtualStatus = 'APROVADO';
        atualizarAbas();
        exibirSolicitacoes();
    });

    document.getElementById("aba-rejeitadas").addEventListener("click", () => {
        filtroAtualStatus = 'RECUSADO';
        atualizarAbas();
        exibirSolicitacoes();
    });
}

function atualizarAbas() {
    document.getElementById("aba-pendentes").classList.toggle("bg-purple-600", filtroAtualStatus === 'PENDENTE');
    document.getElementById("aba-pendentes").classList.toggle("text-white", filtroAtualStatus === 'PENDENTE');
    document.getElementById("aba-pendentes").classList.toggle("bg-slate-100", filtroAtualStatus !== 'PENDENTE');
    document.getElementById("aba-pendentes").classList.toggle("text-slate-700", filtroAtualStatus !== 'PENDENTE');

    document.getElementById("aba-aprovadas").classList.toggle("bg-purple-600", filtroAtualStatus === 'APROVADO');
    document.getElementById("aba-aprovadas").classList.toggle("text-white", filtroAtualStatus === 'APROVADO');
    document.getElementById("aba-aprovadas").classList.toggle("bg-slate-100", filtroAtualStatus !== 'APROVADO');
    document.getElementById("aba-aprovadas").classList.toggle("text-slate-700", filtroAtualStatus !== 'APROVADO');

    document.getElementById("aba-rejeitadas").classList.toggle("bg-purple-600", filtroAtualStatus === 'RECUSADO');
    document.getElementById("aba-rejeitadas").classList.toggle("text-white", filtroAtualStatus === 'RECUSADO');
    document.getElementById("aba-rejeitadas").classList.toggle("bg-slate-100", filtroAtualStatus !== 'RECUSADO');
    document.getElementById("aba-rejeitadas").classList.toggle("text-slate-700", filtroAtualStatus !== 'RECUSADO');
}

async function logoff(){
    try {
        const retorno = await fetch("../../../../z_login/logoff.php");
        const resposta = await retorno.json();
        if(resposta.status == "ok"){
            window.location.href = "../../../../z_login/";
        }
    } catch (e) {
        console.error("Erro no logoff:", e);
    }
}

function obterTurmaIdDoUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('turma_id');
}

async function carregarSolicitacoes(){
    const turmaId = obterTurmaIdDoUrl();
    
    if (!turmaId) {
        document.getElementById("solicitacoes-container").innerHTML = '<div class="p-6 text-center text-red-500">Turma não especificada</div>';
        return;
    }

    try {
        const retorno = await fetch(`php/turmas_detalhes.php?turma_id=${encodeURIComponent(turmaId)}`);
        const resposta = await retorno.json();

        if (resposta.status == "ok") {
            document.getElementById("turma-nome").textContent = resposta.turma.nome;
            document.getElementById("turma-curso").textContent = resposta.turma.curso_nome;
            
            solicitacoesCompletas = resposta.data || [];
            atualizarContadores();
            exibirSolicitacoes();
        } else {
            document.getElementById("solicitacoes-container").innerHTML = `<div class="p-6 text-center text-slate-500">${resposta.mensagem || 'Erro ao carregar solicitações'}</div>`;
        }
    } catch (e) {
        console.error("Erro ao carregar solicitações:", e);
        document.getElementById("solicitacoes-container").innerHTML = '<div class="p-6 text-center text-red-500">Erro ao conectar ao servidor</div>';
    }
}

function atualizarContadores() {
    const pendentes = solicitacoesCompletas.filter(s => s.status === 'PENDENTE').length;
    const aprovadas = solicitacoesCompletas.filter(s => s.status === 'APROVADO').length;
    const rejeitadas = solicitacoesCompletas.filter(s => s.status === 'RECUSADO').length;

    document.getElementById("count-pendentes").textContent = pendentes;
    document.getElementById("count-aprovadas").textContent = aprovadas;
    document.getElementById("count-rejeitadas").textContent = rejeitadas;
}

function exibirSolicitacoes() {
    const filtradas = solicitacoesCompletas.filter(s => s.status === filtroAtualStatus);
    const container = document.getElementById("solicitacoes-container");

    if (filtradas.length === 0) {
        container.innerHTML = `
            <div class="p-12 text-center text-slate-500">
                <i data-lucide="inbox" class="w-12 h-12 mx-auto mb-4 opacity-50"></i>
                <p class="text-lg font-medium">Nenhuma solicitação ${getTextoStatus(filtroAtualStatus)}</p>
            </div>
        `;
        lucide.createIcons();
        return;
    }

    container.innerHTML = filtradas.map(solicitacao => `
        <div class="p-6 border-b border-slate-100 hover:bg-slate-50 transition-colors last:border-b-0">
            <div class="flex items-start justify-between gap-4 mb-4">
                <div class="flex-1">
                    <h3 class="font-semibold text-slate-900">${solicitacao.estudante_nome}</h3>
                    <p class="text-sm text-slate-500">${solicitacao.email}</p>
                </div>
                <span class="inline-flex items-center rounded-full ${getCorStatus(solicitacao.status)} px-3 py-1 text-xs font-bold uppercase tracking-wide">
                    ${getTextoStatus(solicitacao.status)}
                </span>
            </div>

            <div class="bg-slate-50 rounded-lg p-4 mb-4 space-y-2 text-sm">
                <div class="flex justify-between">
                    <span class="text-slate-600">Categoria:</span>
                    <span class="font-semibold text-slate-900">${solicitacao.categoria || 'Sem categoria'}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-slate-600">Horas:</span>
                    <span class="font-semibold text-slate-900">${solicitacao.horas_solicitadas}h</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-slate-600">Data:</span>
                    <span class="font-semibold text-slate-900">${formatarData(solicitacao.data_criacao)}</span>
                </div>
            </div>

            <p class="text-sm text-slate-700 mb-4 italic">"${solicitacao.descricao || 'Sem descrição'}"</p>

            ${filtroAtualStatus === 'PENDENTE' ? `
                <div class="flex gap-2">
                    <button onclick="aprovar(${solicitacao.id})" class="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm flex items-center justify-center gap-2">
                        <i data-lucide="check" class="w-4 h-4"></i>
                        Aprovar
                    </button>
                    <button onclick="rejeitar(${solicitacao.id})" class="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm flex items-center justify-center gap-2">
                        <i data-lucide="x" class="w-4 h-4"></i>
                        Rejeitar
                    </button>
                </div>
            ` : ''}
        </div>
    `).join('');

    lucide.createIcons();
}

function getTextoStatus(status) {
    const mapa = {
        'PENDENTE': 'Pendente',
        'APROVADO': 'Aprovada',
        'RECUSADO': 'Rejeitada'
    };
    return mapa[status] || status;
}

function getCorStatus(status) {
    const cores = {
        'PENDENTE': 'bg-orange-100 text-orange-700',
        'APROVADO': 'bg-emerald-100 text-emerald-700',
        'RECUSADO': 'bg-red-100 text-red-700'
    };
    return cores[status] || 'bg-slate-100 text-slate-700';
}

function formatarData(data) {
    const date = new Date(data);
    return date.toLocaleDateString('pt-BR', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit' 
    });
}

async function aprovar(solicitacaoId) {
    // Aqui seria necessário um endpoint para aprovar
    // Este é um placeholder - você precisará implementar no backend
    console.log("Aprovar solicitação:", solicitacaoId);
    alert("Funcionalidade de aprovação será implementada em breve");
}

async function rejeitar(solicitacaoId) {
    // Aqui seria necessário um endpoint para rejeitar
    // Este é um placeholder - você precisará implementar no backend
    console.log("Rejeitar solicitação:", solicitacaoId);
    alert("Funcionalidade de rejeição será implementada em breve");
}
