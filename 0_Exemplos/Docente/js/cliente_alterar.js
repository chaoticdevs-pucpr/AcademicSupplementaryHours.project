// Fase 1
// a) PEGA o ID da URL 
// b) Requisita o BACKEND por GET
// c) Preenche o formulário com os dados do BACKEND
// ----------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    // pega a URL e armazena em um const
    // busca nessa URL a variável id e armazana no const id.
    valida_sessao();
    const url = new URLSearchParams(window.location.search);
    const id = url.get("id");
    buscar(id);
});

async function buscar(id){
    const retorno = await fetch("../php/cliente_get.php?id="+id);
    const resposta = await retorno.json();
    if(resposta.status == "ok"){
        alert("SUCESSO:" + resposta.mensagem);
        var registro = resposta.data[0];
        document.getElementById("nome").value = registro.nome;
        document.getElementById("usuario").value = registro.usuario;
        document.getElementById("email").value = registro.email;
        document.getElementById("senha").value = registro.senha;
        document.getElementById("ativo").value = registro.ativo;
        document.getElementById("id").value = id;
    }else{
        alert("ERRO:" + resposta.mensagem);
        window.location.href = "../home/";
    }
}

// ----------------------------------------------
// Fase 2
document.getElementById("enviar").addEventListener("click", () => {
    alterar();
});

async function alterar(){
    var nome    = document.getElementById("nome").value;
    var usuario = document.getElementById("usuario").value;
    var senha   = document.getElementById("senha").value;
    var email   = document.getElementById("email").value;
    var ativo   = document.getElementById("ativo").value;
    var id      = document.getElementById("id").value;

    const fd = new FormData();
    fd.append("nome", nome);
    fd.append("usuario", usuario);
    fd.append("senha", senha);
    fd.append("email", email);
    fd.append("ativo", ativo);

    const retorno = await fetch("../php/cliente_alterar.php?id="+id,
        {
          method: 'POST',
          body: fd  
        });
    const resposta = await retorno.json();
    if(resposta.status == "ok"){
        alert("SUCESSO: " + resposta.mensagem);
        window.location.href = '../home/'
    }else{
        alert("ERRO: " + resposta.mensagem);
    }
}