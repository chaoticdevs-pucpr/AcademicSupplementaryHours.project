document.addEventListener("DOMContentLoaded", async () => {
    valida_sessao('ADMIN');
    await carregarTurmas();

    const url = new URLSearchParams(window.location.search);
    const id = url.get("id");
    if(id){
        buscar(id);
    }else{
        alert("ID não informado.");
        window.location.href = "estudante_index.html";
    }
});

document.getElementById("logoff").addEventListener("click", () => {
    logoff();
});

async function logoff(){
    const retorno = await fetch("../../../z_login/logoff.php");
    const resposta = await retorno.json();
    if(resposta.status == "ok"){
        window.location.href = "../../../z_login/";
    }
}

document.getElementById("enviar").addEventListener("click", () => {
    alterar();
});

async function carregarTurmas(){
    const retorno = await fetch("estudante_turmas.php");
    const resposta = await retorno.json();
    if(resposta.status == "ok"){
        var html = '<option value="">Selecione...</option>';
        for(var i = 0; i < resposta.data.length; i++){
            html += `<option value="${resposta.data[i].id}">${resposta.data[i].curso_nome} - ${resposta.data[i].nome}</option>`;
        }
        document.getElementById("turma_id").innerHTML = html;
    }
}

async function buscar(id){
    const retorno = await fetch("estudante_get.php?id=" + id);
    const resposta = await retorno.json();
    if(resposta.status == "ok"){
        const r = resposta.data[0];
        document.getElementById("id").value = r.id;
        document.getElementById("matricula_id").value = r.matricula_id ?? "";
        document.getElementById("nome").value = r.nome;
        document.getElementById("email").value = r.email;
        document.getElementById("cpf").value = r.cpf;
        document.getElementById("celular").value = r.celular;
        document.getElementById("telefone").value = r.telefone;
        document.getElementById("turma_id").value = r.turma_id ?? "";
    }else{
        alert(resposta.mensagem);
        window.location.href = "estudante_index.html";
    }
}

async function alterar(){
    var id          = document.getElementById("id").value;
    var nome        = document.getElementById("nome").value;
    var email       = document.getElementById("email").value;
    var senha       = document.getElementById("senha").value;
    var cpf         = document.getElementById("cpf").value;
    var celular     = document.getElementById("celular").value;
    var telefone    = document.getElementById("telefone").value;
    var turma_id    = document.getElementById("turma_id").value;

    const fd = new FormData();
    fd.append("id", id);
    fd.append("nome", nome);
    fd.append("email", email);
    fd.append("senha", senha);
    fd.append("cpf", cpf);
    fd.append("celular", celular);
    fd.append("telefone", telefone);
    fd.append("turma_id", turma_id);

    const retorno = await fetch("estudante_alterar.php?id=" + id, {
        method: "POST",
        body: fd
    });
    const resposta = await retorno.json();

    if(resposta.status == "ok"){
        alert("SUCESSO: " + resposta.mensagem);
        window.location.href = "estudante_index.html";
    }else{
        alert("ERRO: " + resposta.mensagem);
    }
}

/* se nao der certo testa esse codigo dps little

document.addEventListener("DOMContentLoaded", async () => {
    // 1. Valida a sessão do Administrador
    if (typeof valida_sessao === 'function') {
        valida_sessao('ADMIN');
    }

    // 2. Preenche o ano no footer automaticamente
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    // 3. Inicializa os ícones do Lucide
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 4. Carrega as turmas primeiro
    await carregarTurmas();

    // 5. Pega o ID da URL e busca os dados do estudante
    const urlParams = new URLSearchParams(window.location.search);
    const idEstudante = urlParams.get("id");

    if (idEstudante) {
        buscar(idEstudante);
    } else {
        alert("ID do estudante não encontrado na URL.");
        window.location.href = "estudante_index.html";
    }

    // 6. Configura os eventos de clique nos botões
    const btnLogoff = document.getElementById("logoff");
    if (btnLogoff) {
        btnLogoff.addEventListener("click", logoff);
    }

    const btnEnviar = document.getElementById("enviar");
    if (btnEnviar) {
        btnEnviar.addEventListener("click", alterar);
    }
});

// --- FUNÇÕES DE APOIO ---

async function logoff() {
    try {
        const retorno = await fetch("../../../z_login/logoff.php");
        const resposta = await retorno.json();
        if (resposta.status === "ok") {
            window.location.href = "../../../z_login/";
        }
    } catch (e) {
        console.error("Erro ao deslogar:", e);
    }
}

async function carregarTurmas() {
    try {
        const retorno = await fetch("estudante_turmas.php");
        const resposta = await retorno.json();
        if (resposta.status === "ok") {
            let html = '<option value="">Selecione uma turma...</option>';
            resposta.data.forEach(turma => {
                html += `<option value="${turma.id}">${turma.curso_nome} - ${turma.nome}</option>`;
            });
            document.getElementById("turma_id").innerHTML = html;
        }
    } catch (e) {
        console.error("Erro ao carregar turmas:", e);
    }
}

async function buscar(id) {
    try {
        const retorno = await fetch("estudante_get.php?id=" + id);
        const resposta = await retorno.json();
        
        if (resposta.status === "ok") {
            const r = resposta.data[0];
            // Preenche os campos do formulário com os IDs originais
            document.getElementById("id").value = r.id;
            document.getElementById("matricula_id").value = r.matricula_id ?? "";
            document.getElementById("nome").value = r.nome;
            document.getElementById("email").value = r.email;
            document.getElementById("cpf").value = r.cpf;
            document.getElementById("celular").value = r.celular;
            document.getElementById("telefone").value = r.telefone;
            document.getElementById("turma_id").value = r.turma_id ?? "";
        } else {
            alert(resposta.mensagem);
            window.location.href = "estudante_index.html";
        }
    } catch (e) {
        console.error("Erro ao buscar dados do estudante. Verifique a resposta do PHP na aba Network.", e);
    }
}

async function alterar() {
    const id = document.getElementById("id").value;
    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    const cpf = document.getElementById("cpf").value;
    const celular = document.getElementById("celular").value;
    const telefone = document.getElementById("telefone").value;
    const turma_id = document.getElementById("turma_id").value;

    if (!nome || !email) {
        alert("Campos Nome e E-mail são obrigatórios.");
        return;
    }

    const fd = new FormData();
    fd.append("id", id);
    fd.append("nome", nome);
    fd.append("email", email);
    fd.append("senha", senha);
    fd.append("cpf", cpf);
    fd.append("celular", celular);
    fd.append("telefone", telefone);
    fd.append("turma_id", turma_id);

    try {
        // Envia para o PHP de alteração
        const retorno = await fetch("estudante_alterar.php?id=" + id, {
            method: "POST",
            body: fd
        });
        const resposta = await retorno.json();

        if (resposta.status === "ok") {
            alert("SUCESSO: " + resposta.mensagem);
            window.location.href = "estudante_index.html";
        } else {
            alert("ERRO: " + resposta.mensagem);
        }
    } catch (e) {
        alert("Erro técnico ao salvar as alterações. Verifique o console.");
        console.error(e);
    }
}

*/

