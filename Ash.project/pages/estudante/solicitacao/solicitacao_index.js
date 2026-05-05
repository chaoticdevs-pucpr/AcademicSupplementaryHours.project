document.addEventListener("DOMContentLoaded", () => {
    valida_sessao('ESTUDANTE');
    buscar();
});


const btnLogoff = document.getElementById("logoff");
if (btnLogoff) {
    btnLogoff.addEventListener("click", () => {
        logoff();
    });
}

async function logoff() {
    try {
        const retorno = await fetch("../../../z_login/logoff.php");
        const resposta = await retorno.json();
        if (resposta.status == "ok") {
            window.location.href = "../../../z_login/";
        }
    } catch (e) {
        console.error("Erro no logoff:", e);
    }
}

async function buscar() {
    try {
        const retorno = await fetch("php/solicitacao_get.php");
        const resposta = await retorno.json();
        
        if (resposta.status == "ok" && resposta.data && resposta.data.length > 0) {
            preencherTabela(resposta.data);
        } else {
            preencherTabela([]);
        }
    } catch (e) {
        console.error("Erro ao buscar solicitações:", e);
        preencherTabela([]);
    }
}

async function excluir(id) {
    if (confirm("Tem certeza que deseja excluir esta solicitação de horas?")) {
        try {
            const retorno = await fetch("php/solicitacao_excluir.php?id=" + id);
            const resposta = await retorno.json();
            if (resposta.status == "ok") {
                alert("SUCESSO: " + resposta.mensagem);
                buscar();
            } else {
                alert("ERRO: " + resposta.mensagem);
            }
        } catch (e) {
            console.error("Erro ao excluir solicitação:", e);
            alert("Erro de comunicação com o servidor.");
        }
    }
}

function preencherTabela(tabela) {
    // Estilo de tabela limpo, focado na leitura clara dos dados
    var html = `
    <div>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Categoria</th>
                    <th>Subcategoria</th>
                    <th>Horas Brutas</th>
                    <th>Status</th>
                    <th>Data de Envio</th>
                    <th>Anexo</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>`;

    if (!tabela || tabela.length === 0) {
        html += `
        <tr>
            <td colspan="8">
                Ainda não enviou nenhuma solicitação de horas complementares.
            </td>
        </tr>`;
    } else {
        for (var i = 0; i < tabela.length; i++) {
            const item = tabela[i];
            
            // Lógica para criar um Badge colorido dependendo do Status
            let statusBadge = '';
            let s = item.status ? item.status.toUpperCase() : '';
            
            if (s === 'PENDENTE') {
                statusBadge = `<span>${item.status}</span>`;
            } else if (s === 'APROVADO' || s === 'DEFERIDO' || s === 'DEFERIDA') {
                statusBadge = `<span>${item.status}</span>`;
            } else if (s === 'REJEITADO' || s === 'INDEFERIDO' || s === 'INDEFERIDA' || s === 'RECUSADO') {
                statusBadge = `<span>${item.status}</span>`;
            } else {
                statusBadge = `<span>${item.status || '---'}</span>`;
            }

            // Anexo com ícone bonitinho (SVG do Lucide incorporado)
            const anexo = item.caminho_arquivo && item.caminho_arquivo !== "null"
                ? `<a href="../../${item.caminho_arquivo}" target="_blank">
                    Arquivo
                   </a>` 
                : `<span>Sem anexo</span>`;

            // Proteção contra datas "null" do banco
            const dataEnvio = (item.data_envio && item.data_envio !== "null") ? item.data_envio : '---';

            html += `
            <tr>
                <td>${item.id}</td>
                <td>${item.categoria_nome || '---'}</td>
                <td>${item.subcategoria_nome || '---'}</td>
                <td>${item.horas_brutas || '0'}h</td>
                <td>${statusBadge}</td>
                <td>${dataEnvio}</td>
                <td>${anexo}</td>
                <td>
                    <a href="html/solicitacao_alterar.html?id=${item.id}">
                        Alterar
                    </a>
                    <button onclick="excluir(${item.id})">
                        Excluir
                    </button>
                </td>
            </tr>`;
        }
    }

    html += `</tbody></table></div>`;
    
    // Injeção segura da tabela no HTML
    const container = document.getElementById("lista");
    if(container) {
        container.innerHTML = html;
    } else {
        console.error("Contentor com ID 'lista' não encontrado no HTML.");
    }
}