document.addEventListener("DOMContentLoaded", () => {
    valida_sessao('COORDENADOR');
    carregarTurmas();
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

function somenteDigitos(valor){
    return (valor || "").replace(/\D/g, "");
}

function validarFormulario(dados){
    if(!dados.nome || !dados.email || !dados.senha || !dados.cpf || !dados.celular || !dados.turma_id){
        return "Preencha todos os campos obrigatorios. Telefone e opcional.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(dados.email)){
        return "Informe um e-mail valido.";
    }

    if(dados.cpf.length !== 11){
        return "CPF invalido. Informe 11 digitos.";
    }

    if(dados.celular.length < 10 || dados.celular.length > 11){
        return "Celular invalido. Informe 10 ou 11 digitos.";
    }

    if(dados.telefone && (dados.telefone.length < 10 || dados.telefone.length > 11)){
        return "Telefone invalido. Informe 10 ou 11 digitos.";
    }

    return "";
}

document.getElementById("turma_id").addEventListener("change", () => {
    preencherCursoSelecionado();
});

async function carregarTurmas(){
    const retorno = await fetch("prof_validador_turmas.php");
    const resposta = await retorno.json();
    if(resposta.status == "ok"){
        var html = '<option value="">Selecione...</option>';
        for(var i = 0; i < resposta.data.length; i++){
            const ocupada = resposta.data[i].ocupada == 1;
            html += `<option value="${resposta.data[i].id}" data-curso="${resposta.data[i].curso_nome}" ${ocupada ? 'disabled' : ''}>${resposta.data[i].nome}${ocupada ? ' (ocupada)' : ''}</option>`;
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
    var nome        = document.getElementById("nome").value.trim();
    var email       = document.getElementById("email").value.trim();
    var senha       = document.getElementById("senha").value.trim();
    var cpf         = somenteDigitos(document.getElementById("cpf").value);
    var celular     = somenteDigitos(document.getElementById("celular").value);
    var telefone    = somenteDigitos(document.getElementById("telefone").value);
    var turma_id    = document.getElementById("turma_id").value;

    const erroValidacao = validarFormulario({ nome, email, senha, cpf, celular, telefone, turma_id });
    if(erroValidacao){
        alert(erroValidacao);
        return;
    }

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

