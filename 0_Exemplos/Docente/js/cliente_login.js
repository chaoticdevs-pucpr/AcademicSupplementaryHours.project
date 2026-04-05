document.getElementById("enviar").addEventListener("click", () => {
    login();
});
async function login(){
    var usuario = document.getElementById("usuario").value;
    var senha = document.getElementById("senha").value;
    const fd = new FormData();
    fd.append("usuario", usuario);
    fd.append("senha", senha);
    const retorno = await fetch("../php/cliente_login.php",{
            method: "POST",
            body: fd
        }
    );
    const resposta = await retorno.json();
    if(resposta.status == "ok"){
        window.location.href = "../home/";
    }else{
        alert("Credenciais invalidas.");
    }
}