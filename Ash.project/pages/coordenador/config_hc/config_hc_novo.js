document.addEventListener("DOMContentLoaded", () => {
	valida_sessao('COORDENADOR');
	carregarCategorias();
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

document.getElementById("categoria_nome").addEventListener("change", () => {
	carregarSubcategorias();
	preencherCategoriaMax();
	document.getElementById("subcategoria_horas").value = "";
});

document.getElementById("subcategoria_nome").addEventListener("change", () => {
	preencherSubcategoriaHoras();
});

async function carregarCategorias(){
	const retorno = await fetch("config_hc_categorias.php");
	const resposta = await retorno.json();
	if(resposta.status == "ok"){
		var html = '<option value="">Selecione...</option>';
		for(var i = 0; i < resposta.data.length; i++){
			html += `<option value="${resposta.data[i].id}" data-max-horas="${resposta.data[i].max_horas}">${resposta.data[i].nome}</option>`;
		}
		document.getElementById("categoria_nome").innerHTML = html;
	}else{
		document.getElementById("categoria_nome").innerHTML = '<option value="">Sem categorias disponiveis</option>';
		document.getElementById("subcategoria_nome").innerHTML = '<option value="">Sem subcategorias disponiveis</option>';
		alert("ERRO: " + resposta.mensagem);
	}
}

async function carregarSubcategorias(){
	const categoria_id = document.getElementById("categoria_nome").value;
	if(categoria_id == ""){
		document.getElementById("subcategoria_nome").innerHTML = '<option value="">Selecione categoria primeiro</option>';
		return;
	}

	const retorno = await fetch("config_hc_subcategorias.php?categoria_id=" + categoria_id);
	const resposta = await retorno.json();
	if(resposta.status == "ok"){
		var html = '<option value="">Selecione...</option>';
		for(var i = 0; i < resposta.data.length; i++){
			html += `<option value="${resposta.data[i].id}" data-horas="${resposta.data[i].quant_horas}">${resposta.data[i].nome} (${resposta.data[i].quant_horas}h)</option>`;
		}
		document.getElementById("subcategoria_nome").innerHTML = html;
	}else{
		document.getElementById("subcategoria_nome").innerHTML = '<option value="">Sem subcategorias disponiveis</option>';
		alert("ERRO: " + resposta.mensagem);
	}
}

function preencherCategoriaMax(){
	const select = document.getElementById("categoria_nome");
	const opcao = select.options[select.selectedIndex];
	if(opcao && opcao.value != ""){
		document.getElementById("categoria_max").value = opcao.getAttribute("data-max-horas") || "";
	}else{
		document.getElementById("categoria_max").value = "";
	}
}

function preencherSubcategoriaHoras(){
	const select = document.getElementById("subcategoria_nome");
	const opcao = select.options[select.selectedIndex];
	if(opcao && opcao.value != ""){
		document.getElementById("subcategoria_horas").value = opcao.getAttribute("data-horas") || "";
	}else{
		document.getElementById("subcategoria_horas").value = "";
	}
}

async function novo(){
	var versao              = document.getElementById("versao").value;
	var data_manual         = document.getElementById("data_manual").value;
	var horas_objetivo      = document.getElementById("horas_objetivo").value;
	var categoria_nome      = "";
	var categoria_max       = document.getElementById("categoria_max").value;
	var subcategoria_nome   = "";
	var subcategoria_horas  = document.getElementById("subcategoria_horas").value;

	const categoriaSelect = document.getElementById("categoria_nome");
	const categoriaOpcao = categoriaSelect.options[categoriaSelect.selectedIndex];
	if(categoriaOpcao && categoriaOpcao.value != ""){
		categoria_nome = categoriaOpcao.text;
	}

	const subcategoriaSelect = document.getElementById("subcategoria_nome");
	const subcategoriaOpcao = subcategoriaSelect.options[subcategoriaSelect.selectedIndex];
	if(subcategoriaOpcao && subcategoriaOpcao.value != ""){
		subcategoria_nome = subcategoriaOpcao.text.replace(/\s*\([^)]*h\)\s*$/, "");
	}

	const fd = new FormData();
	fd.append("versao", versao);
	fd.append("data_manual", data_manual);
	fd.append("horas_objetivo", horas_objetivo);
	fd.append("categoria_nome", categoria_nome);
	fd.append("categoria_max", categoria_max);
	fd.append("subcategoria_nome", subcategoria_nome);
	fd.append("subcategoria_horas", subcategoria_horas);

	const retorno = await fetch("config_hc_novo.php", {
		method: "POST",
		body: fd
	});
	const resposta = await retorno.json();

	if(resposta.status == "ok"){
		alert("SUCESSO: " + resposta.mensagem);
		window.location.href = "config_hc_index.html";
	}else{
		alert("ERRO: " + resposta.mensagem);
	}
}
 