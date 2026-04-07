document.getElementById("enviar").addEventListener("click", () => {
    consulta();
});

async function consulta(){
    var usuario = document.getElementById("usuario").value;
    var senha = document.getElementById("senha").value;
    
    const fd = new FormData();
    fd.append("usuario", usuario);
    fd.append("senha", senha);
    
    const retorno = await fetch("../z_php/projeto_login.php", {
        method: 'POST',
        body: fd
    });

    const resposta = await retorno.json();
    if(resposta.status == "ok"){
        alert("Login realizado com sucesso");
        window.location.href = '../home/index.html';
    }else{
        alert("Falha nas credênciais fornecidas");
    }
}