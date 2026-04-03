document.addEventListener("DOMContentLoaded", async () => {
    valida_sessao();
    await carregarCursos();

    const url = new URLSearchParams(window.location.search);
    const id = url.get("id");
    if(id){
        buscar(id);
    }else{
        alert("ID não informado.");
        window.location.href = "coordenador_index.html";
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

async function carregarCursos(){
    const retorno = await fetch("coordenador_cursos.php");
    const resposta = await retorno.json();
    if(resposta.status == "ok"){
        var html = '<option value="">Selecione...</option>';
        for(var i = 0; i < resposta.data.length; i++){
            html += `<option value="${resposta.data[i].id}">${resposta.data[i].nome}</option>`;
        }
        document.getElementById("curso_id").innerHTML = html;
    }
}

async function buscar(id){
    const retorno = await fetch("coordenador_get.php?id=" + id);
    const resposta = await retorno.json();
    if(resposta.status == "ok"){
        const r = resposta.data[0];
        document.getElementById("id").value = r.id;
        document.getElementById("nome").value = r.nome;
        document.getElementById("email").value = r.email;
        document.getElementById("cpf").value = r.cpf;
        document.getElementById("celular").value = r.celular;
        document.getElementById("telefone").value = r.telefone;
        document.getElementById("curso_id").value = r.curso_id;
    }else{
        alert(resposta.mensagem);
        window.location.href = "coordenador_index.html";
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
    var curso_id    = document.getElementById("curso_id").value;

    const fd = new FormData();
    fd.append("id", id);
    fd.append("nome", nome);
    fd.append("email", email);
    fd.append("senha", senha);
    fd.append("cpf", cpf);
    fd.append("celular", celular);
    fd.append("telefone", telefone);
    fd.append("curso_id", curso_id);

    const retorno = await fetch("coordenador_alterar.php?id=" + id, {
        method: "POST",
        body: fd
    });
    const resposta = await retorno.json();

    if(resposta.status == "ok"){
        alert("SUCESSO: " + resposta.mensagem);
        window.location.href = "coordenador_index.html";
    }else{
        alert("ERRO: " + resposta.mensagem);
    }
}

