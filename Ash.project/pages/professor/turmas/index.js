let turmasCompletas = [];
let filtroStatus = 'todas';

document.addEventListener("DOMContentLoaded", () => {
    valida_sessao('PROFESSOR');
    carregarTurmas();
    configurarEventos();
});

function configurarEventos() {
    const btnLogoff = document.getElementById("logoff");
    if (btnLogoff) {
        btnLogoff.addEventListener("click", () => {
            logoff();
        });
    }

    document.getElementById("filtro_periodo").addEventListener("change", aplicarFiltros);
    document.getElementById("filtro_semestre").addEventListener("change", aplicarFiltros);
    document.getElementById("btn-todas").addEventListener("click", () => {
        filtroStatus = 'todas';
        document.getElementById("btn-todas").classList.add("bg-purple-600", "text-white");
        document.getElementById("btn-todas").classList.remove("bg-slate-100", "text-slate-700");
        document.getElementById("btn-pendentes").classList.remove("bg-purple-600", "text-white");
        document.getElementById("btn-pendentes").classList.add("bg-slate-100", "text-slate-700");
        aplicarFiltros();
    });
    
    document.getElementById("btn-pendentes").addEventListener("click", () => {
        filtroStatus = 'pendentes';
        document.getElementById("btn-pendentes").classList.add("bg-purple-600", "text-white");
        document.getElementById("btn-pendentes").classList.remove("bg-slate-100", "text-slate-700");
        document.getElementById("btn-todas").classList.remove("bg-purple-600", "text-white");
        document.getElementById("btn-todas").classList.add("bg-slate-100", "text-slate-700");
        aplicarFiltros();
    });

    document.getElementById("btn-reload").addEventListener("click", () => {
        carregarTurmas();
    });
}

async function logoff(){
    try {
        const retorno = await fetch("../../../z_login/logoff.php");
        const resposta = await retorno.json();
        if(resposta.status == "ok"){
            window.location.href = "../../../z_login/";
        }
    } catch (e) {
        console.error("Erro no logoff:", e);
    }
}

async function carregarTurmas(){
    try {
        const retorno = await fetch("php/turmas_professor.php");
        const resposta = await retorno.json();

        if (resposta.status == "ok" && resposta.data && resposta.data.length > 0) {
            turmasCompletas = resposta.data;
            preencherFiltrosPeriodo();
            aplicarFiltros();
        } else {
            turmasCompletas = [];
            mostrarEstadoVazio();
        }
    } catch (e) {
        console.error("Erro ao carregar turmas:", e);
        turmasCompletas = [];
        mostrarEstadoVazio();
    }
}

function preencherFiltrosPeriodo() {
    const periodos = [...new Set(turmasCompletas.map(t => t.periodo || t.ano))].filter(Boolean).sort().reverse();
    const selectPeriodo = document.getElementById("filtro_periodo");
    
    periodos.forEach(periodo => {
        const option = document.createElement('option');
        option.value = periodo;
        option.textContent = periodo;
        selectPeriodo.appendChild(option);
    });
}

function aplicarFiltros() {
    const periodoselecionado = document.getElementById("filtro_periodo").value;
    const semestre = document.getElementById("filtro_semestre").value;

    let turmasFiltradas = turmasCompletas.filter(turma => {
        const matchPeriodo = !periodoselecionado || (turma.periodo || turma.ano) == periodoselecionado;
        const matchSemestre = !semestre || turma.semestre == semestre;
        const matchStatus = filtroStatus === 'todas' || (filtroStatus === 'pendentes' && turma.pendencias > 0);
        
        return matchPeriodo && matchSemestre && matchStatus;
    });

    preencherGrid(turmasFiltradas);
    document.getElementById("turmas-count").textContent = `(${turmasFiltradas.length})`;
}

function preencherGrid(turmas) {
    const grid = document.getElementById("turmas-grid");
    const estadoVazio = document.getElementById("estado-vazio");

    if (turmas.length === 0) {
        grid.innerHTML = '';
        estadoVazio.classList.remove('hidden');
        return;
    }

    estadoVazio.classList.add('hidden');
    grid.innerHTML = turmas.map(turma => `
        <div class="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg hover:border-purple-200 transition-all group">
            <div class="flex items-start justify-between mb-4">
                <div class="flex-1">
                    <h3 class="text-lg font-bold text-slate-900 group-hover:text-purple-600 transition-colors">${turma.nome}</h3>
                    <p class="text-xs text-slate-500 mt-1">${turma.curso_nome || 'Sem curso'}</p>
                </div>
                ${turma.pendencias > 0 ? `
                    <span class="inline-flex items-center rounded-full bg-orange-100 text-orange-700 px-2.5 py-1 text-xs font-bold uppercase tracking-wide whitespace-nowrap ml-2">
                        ${turma.pendencias}
                    </span>
                ` : `
                    <span class="inline-flex items-center rounded-full bg-emerald-100 text-emerald-700 px-2.5 py-1 text-xs font-bold uppercase tracking-wide whitespace-nowrap ml-2">
                        OK
                    </span>
                `}
            </div>

            <div class="bg-slate-50 rounded-xl p-4 mb-4 space-y-2">
                <div class="flex justify-between text-sm">
                    <span class="text-slate-600">Período:</span>
                    <span class="font-semibold text-slate-900">${turma.periodo || turma.ano || 'N/A'}</span>
                </div>
                <div class="flex justify-between text-sm">
                    <span class="text-slate-600">Semestre:</span>
                    <span class="font-semibold text-slate-900">${turma.semestre ? turma.semestre + 'º' : 'N/A'}</span>
                </div>
                <div class="flex justify-between text-sm">
                    <span class="text-slate-600">Total de alunos:</span>
                    <span class="font-semibold text-slate-900">${turma.total_alunos || 0}</span>
                </div>
            </div>

            <a href="detalhes.html?turma_id=${turma.id}" class="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-center text-sm flex items-center justify-center gap-2 group/btn">
                <i data-lucide="eye" class="w-4 h-4"></i>
                Ver Detalhes
                <i data-lucide="arrow-right" class="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform"></i>
            </a>
        </div>
    `).join('');

    lucide.createIcons();
}

function mostrarEstadoVazio() {
    document.getElementById("turmas-grid").innerHTML = '';
    document.getElementById("estado-vazio").classList.remove('hidden');
}
