document.addEventListener("DOMContentLoaded", () => {
    valida_sessao();
});

document.getElementById("enviar").addEventListener("click", () => {
    novo();
});

async function novo(){
    var nome    = document.getElementById("nome").value;
    var usuario = document.getElementById("usuario").value;
    var senha   = document.getElementById("senha").value;
    var email   = document.getElementById("email").value;
    var instagram   = document.getElementById("instagram").value;
    var ativo   = document.getElementById("ativo").value;

    const fd = new FormData();
    fd.append("nome", nome);
    fd.append("usuario", usuario);
    fd.append("senha", senha);
    fd.append("email", email);
    fd.append("instagram", instagram);
    fd.append("ativo", ativo);

    const retorno = await fetch("../php/cliente_novo.php",
        {
          method: 'POST',
          body: fd  
        });
    const resposta = await retorno.json();
    if(resposta.status == "ok"){
        alert("SUCESSO: " + resposta.mensagem);
        window.location.href = "../home/";
    }else{
        alert("ERRO: " + resposta.mensagem);
    }
}