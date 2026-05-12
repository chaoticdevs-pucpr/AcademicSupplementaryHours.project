document.addEventListener("DOMContentLoaded", () => {
    valida_sessao('ADMIN');
    carregarCursos();
});

document.getElementById("logoff").addEventListener("click", () => {
    logoff();
});

async function logoff(){
    const retorno = await fetch("../../../../z_login/logoff.php");
    const resposta = await retorno.json();
    if(resposta.status == "ok"){
        window.location.href = "../../../../z_login/";
    }
}

document.getElementById("enviar").addEventListener("click", () => {
    novo();
});

function somenteDigitos(valor){
    return (valor || "").replace(/\D/g, "");
}

function validarFormulario(dados){
    if(!dados.nome || !dados.email || !dados.senha || !dados.cpf || !dados.celular || !dados.curso_id){
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

async function carregarCursos(){
    try {
        const retorno = await fetch("../php/coordenador_cursos.php");
        const resposta = await retorno.json();
        if(resposta.status == "ok"){
            var html = '<option value="">Selecione o curso...</option>';
            for(var i = 0; i < resposta.data.length; i++){
                html += `<option value="${resposta.data[i].id}">${resposta.data[i].nome}</option>`;
            }
            document.getElementById("curso_id").innerHTML = html;
        }
    } catch (e) {
        console.error("Erro ao carregar cursos:", e);
    }
}

async function novo(){
    var nome     = document.getElementById("nome").value.trim();
    var email    = document.getElementById("email").value.trim();
    var senha    = document.getElementById("senha").value.trim();
    var cpf      = somenteDigitos(document.getElementById("cpf").value);
    var celular  = somenteDigitos(document.getElementById("celular").value);
    var telefone = somenteDigitos(document.getElementById("telefone").value);
    var curso_id = document.getElementById("curso_id").value;

    const erroValidacao = validarFormulario({ nome, email, senha, cpf, celular, telefone, curso_id });
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
    fd.append("curso_id", curso_id);

    try {
        const retorno = await fetch("../php/coordenador_novo.php", {
            method: "POST",
            body: fd
        });
        const resposta = await retorno.json();

        if(resposta.status == "ok"){
            alert("SUCESSO: " + resposta.mensagem);
            window.location.href = "../coordenador_index.html";
        }else{
            alert("ERRO: " + resposta.mensagem);
        }
    } catch (e) {
        console.error("Erro na requisição:", e);
        alert("Erro de conexão com o servidor.");
    }
}