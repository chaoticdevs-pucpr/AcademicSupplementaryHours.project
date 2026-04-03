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
	const fd = new FormData();
	fd.append("nome", document.getElementById("nome").value);
	fd.append("email", document.getElementById("email").value);
	fd.append("senha", document.getElementById("senha").value);
	fd.append("cpf", document.getElementById("cpf").value);
	fd.append("celular", document.getElementById("celular").value);
	fd.append("telefone", document.getElementById("telefone").value);
	fd.append("curso_id", document.getElementById("curso_id").value);

	const retorno = await fetch("coordenador_novo.php", {
		method: "POST",
		body: fd
	});
	const resposta = await retorno.json();

	alert(resposta.mensagem);
	if(resposta.status == "ok"){
		window.location.href = "coordenador_index.html";
	}
}

