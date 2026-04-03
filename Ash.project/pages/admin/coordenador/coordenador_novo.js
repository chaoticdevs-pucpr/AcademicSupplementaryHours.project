document.addEventListener("DOMContentLoaded", () => {
    valida_sessao();
    carregarCursos();
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
    novo();
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

async function novo(){
    var nome        = document.getElementById("nome").value;
    var email       = document.getElementById("email").value;
    var senha       = document.getElementById("senha").value;
    var cpf         = document.getElementById("cpf").value;
    var celular     = document.getElementById("celular").value;
    var telefone    = document.getElementById("telefone").value;
    var curso_id    = document.getElementById("curso_id").value;

    const fd = new FormData();
    fd.append("nome", nome);
    fd.append("email", email);
    fd.append("senha", senha);
    fd.append("cpf", cpf);
    fd.append("celular", celular);
    fd.append("telefone", telefone);
    fd.append("curso_id", curso_id);

    const retorno = await fetch("coordenador_novo.php", {
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

