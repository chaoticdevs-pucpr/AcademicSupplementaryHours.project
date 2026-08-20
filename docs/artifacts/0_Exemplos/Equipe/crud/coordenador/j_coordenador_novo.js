document.addEventListener("DOMContentLoaded", () =>  {
    carregarDados();
    document.getElementById("enviar").addEventListener('click', function(){
        novo();
    });
    document.getElementById("logoff").addEventListener("click", () => {
        logoff();
    });
    valida_sessao();
});

async function carregarDados() {
    try {
        const resCursos = await fetch("../z_php/carregar_dados.php?tipo=cursos");
        const cursos = await resCursos.json();
        const selectCurso = document.getElementById("curso_id");
        cursos.forEach(curso => {
            const option = document.createElement("option");
            option.value = curso.id;
            option.textContent = curso.nome;
            selectCurso.appendChild(option);
        });
    } catch (erro) {
        console.error("Erro ao carregar dados:", erro);
    }
}

async function novo(){
    var nome = document.getElementById("nome").value;
    var cpf = document.getElementById("cpf").value;
    var email = document.getElementById("email").value;
    var endereco = document.getElementById("endereco").value;
    var celular = document.getElementById("celular").value;
    var residencial = document.getElementById("residencial").value;
    var curso_id = document.getElementById("curso_id").value;

    console.log("Dados:", {nome, cpf, email, endereco, celular, residencial, curso_id});

    if (!nome || !cpf || !email || !endereco || !celular || !curso_id) {
        alert("Por favor, preencha todos os campos!");
        return;
    }

    const fd = new FormData();
    fd.append('nome', nome);
    fd.append('cpf', cpf);
    fd.append('email', email);
    fd.append('endereco', endereco);
    fd.append('celular', celular);
    fd.append('residencial', residencial);
    fd.append('curso_id', curso_id);

    try {
        const retorno = await fetch("p_coordenador_novo.php",  {
            method: "POST",
            body: fd
        });
        const resposta = await retorno.json();
        
        console.log("Resposta do servidor:", resposta);
        
        if(resposta.status == "ok"){
            alert("Sucesso! " + resposta.mensagem);
            window.location.href = 'h_coordenador_index.html';
        }else{
            alert("ERRO! " + resposta.mensagem);
        }
    } catch (erro) {
        console.error("Erro na requisição:", erro);
        alert("Erro ao enviar dados: " + erro.message);
    }

}