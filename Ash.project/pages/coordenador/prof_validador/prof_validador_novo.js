document.addEventListener("DOMContentLoaded", () => {
    valida_sessao('COORDENADOR');
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

async function carregarTurmas(){
    const retorno = await fetch("prof_validador_turmas.php");
    const resposta = await retorno.json();
    if(resposta.status == "ok"){
        var html = '<option value="">Selecione...</option>';
        for(var i = 0; i < resposta.data.length; i++){
            html += `<option value="${resposta.data[i].id}">${resposta.data[i].nome}</option>`;
        }
        document.getElementById("turma_id").innerHTML = html;
        preencherCursoSelecionado();
    }else{
        alert("ERRO: " + resposta.mensagem);
    }
}

function preencherCursoSelecionado(){
	const select = document.getElementById("turma_id");
	const opcao = select.options[select.selectedIndex];
	if(opcao && opcao.value != ""){
		document.getElementById("curso_nome").value = opcao.getAttribute("data-curso") || "";
	}else{
		document.getElementById("curso_nome").value = "";
	}
}

async function novo(){
    var nome        = document.getElementById("nome").value;
    var email       = document.getElementById("email").value;
    var senha       = document.getElementById("senha").value;
    var cpf         = document.getElementById("cpf").value;
    var celular     = document.getElementById("celular").value;
    var telefone    = document.getElementById("telefone").value;
    var turma_id    = document.getElementById("turma_id").value;

    const fd = new FormData();
    fd.append("nome", nome);
    fd.append("email", email);
    fd.append("senha", senha);
    fd.append("cpf", cpf);
    fd.append("celular", celular);
    fd.append("telefone", telefone);
    fd.append("turma_id", turma_id);

    const retorno = await fetch("prof_validador_novo.php", {
        method: "POST",
        body: fd
    });
    const resposta = await retorno.json();

    if(resposta.status == "ok"){
        alert("SUCESSO: " + resposta.mensagem);
        window.location.href = "prof_validador_index.html";
    }else{
        alert("ERRO: " + resposta.mensagem);
    }
}

