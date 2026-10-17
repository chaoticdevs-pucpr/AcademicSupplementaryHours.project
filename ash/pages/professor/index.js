document.addEventListener("DOMContentLoaded", () => {
    valida_sessao('PROFESSOR');
    carregarDados();
});

const btnLogoff = document.getElementById("logoff");
if (btnLogoff) {
    btnLogoff.addEventListener("click", () => {
        logoff();
    });
}

async function logoff(){
    try {
        const retorno = await fetch("../../z_login/logoff.php");
        const resposta = await retorno.json();
        if(resposta.status == "ok"){
            window.location.href = "../../z_login/";
        }
    } catch (e) {
        console.error("Erro no logoff:", e);
    }
}

async function carregarDados(){
    try {
        const retorno = await fetch("turmas/php/turmas_professor.php");
        const resposta = await retorno.json();

        if (resposta.status == "ok") {
            document.getElementById("user-name").textContent = resposta.professor_nome || "Professor(a)";
            
            let totalPendencias = 0;
            const turmas = resposta.data || [];
            
            turmas.forEach(turma => {
                totalPendencias += turma.pendencias || 0;
            });

            document.getElementById("pending-count").textContent = totalPendencias;
            
            if (totalPendencias === 0) {
                document.getElementById("pending-text").textContent = "Nenhuma solicitação aguardando sua validação";
            } else if (totalPendencias === 1) {
                document.getElementById("pending-text").textContent = "1 solicitação aguardando sua validação";
            } else {
                document.getElementById("pending-text").textContent = totalPendencias + " solicitações aguardando sua validação";
            }

            preencherTurmas(turmas);
        } else {
            document.getElementById("pending-text").textContent = resposta.mensagem || "Erro ao carregar dados";
            document.getElementById("turmas-list").innerHTML = '<div class="text-center text-slate-500 py-8">Erro ao carregar turmas</div>';
        }
    } catch (e) {
        console.error("Erro ao carregar dados:", e);
        document.getElementById("pending-text").textContent = "Erro ao conectar ao servidor";
        document.getElementById("turmas-list").innerHTML = '<div class="text-center text-slate-500 py-8">Erro ao carregar turmas</div>';
    }
}

function preencherTurmas(turmas) {
    const container = document.getElementById("turmas-list");
    
    if (turmas.length === 0) {
        container.innerHTML = '<div class="text-center text-slate-500 py-8">Nenhuma turma encontrada</div>';
        return;
    }

    container.innerHTML = turmas.map(turma => `
        <a href="turmas/?turma_id=${turma.id}" class="bg-white rounded-2xl border border-slate-200 p-5 hover:border-purple-300 hover:shadow-md transition-all group cursor-pointer block">
            <div class="flex items-center justify-between">
                <div class="flex-1">
                    <h4 class="font-semibold text-slate-900 group-hover:text-purple-600 transition-colors">${turma.nome}</h4>
                    <p class="text-xs text-slate-500 mt-1">${turma.curso_nome || 'Sem curso'}</p>
                </div>
                ${turma.pendencias > 0 ? `
                    <span class="inline-flex items-center rounded-full bg-orange-100 text-orange-700 px-3 py-1 text-xs font-bold uppercase tracking-wide ml-4">
                        ${turma.pendencias} pendência${turma.pendencias !== 1 ? 's' : ''}
                    </span>
                ` : `
                    <span class="inline-flex items-center rounded-full bg-emerald-100 text-emerald-700 px-3 py-1 text-xs font-bold uppercase tracking-wide ml-4">
                        OK
                    </span>
                `}
            </div>
        </a>
    `).join('');
}
