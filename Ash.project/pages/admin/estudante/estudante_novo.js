document.addEventListener("DOMContentLoaded", () => {
    valida_sessao('ADMIN');
    carregarTurmas();
});


document.getElementById("logoff").addEventListener("click", () => {
    logoff();
});

async function logoff() {
    const retorno = await fetch("../../../z_login/logoff.php");
    const resposta = await retorno.json();
    if (resposta.status == "ok") {
        window.location.href = "../../../z_login/";
    }
}

document.getElementById("enviar").addEventListener("click", () => {
    novo();
});

async function carregarTurmas() {
    const retorno = await fetch("estudante_turmas.php");
    const resposta = await retorno.json();
    if (resposta.status == "ok") {
        var html = '<option value="">Selecione...</option>';
        for (var i = 0; i < resposta.data.length; i++) {
            html += `<option value="${resposta.data[i].id}">${resposta.data[i].curso_nome} - ${resposta.data[i].nome}</option>`;
        }
        document.getElementById("turma_id").innerHTML = html;
    } else {
        document.getElementById("turma_id").innerHTML = '<option value="">Nenhuma turma encontrada</option>';
    }
}

async function novo() {
    var nome = document.getElementById("nome").value;
    var email = document.getElementById("email").value;
    var senha = document.getElementById("senha").value;
    var cpf = document.getElementById("cpf").value;
    var celular = document.getElementById("celular").value;
    var telefone = document.getElementById("telefone").value;
    var turma_id = document.getElementById("turma_id").value;

    const fd = new FormData();
    fd.append("nome", nome);
    fd.append("email", email);
    fd.append("senha", senha);
    fd.append("cpf", cpf);
    fd.append("celular", celular);
    fd.append("telefone", telefone);
    fd.append("turma_id", turma_id);

    const retorno = await fetch("estudante_novo.php", {
        method: "POST",
        body: fd
    });
    const resposta = await retorno.json();
    if (resposta.status == "ok") {
        alert("SUCESSO: " + resposta.mensagem);
        window.location.href = "estudante_index.html";
    } else {
        alert("ERRO: " + resposta.mensagem);
    }
}
