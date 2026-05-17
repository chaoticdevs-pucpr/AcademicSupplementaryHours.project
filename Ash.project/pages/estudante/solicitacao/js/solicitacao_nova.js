document.addEventListener("DOMContentLoaded", () => {
    valida_sessao('ESTUDANTE');
    carregarCategorias();
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

document.getElementById("categoria_id").addEventListener("change", () => {
	carregarSubcategorias();
});

document.getElementById("subcategoria_id").addEventListener("change", () => {
	atualizarDuracaoVisibilidade();
});

function atualizarDuracaoVisibilidade(){
	const select = document.getElementById('subcategoria_id');
	const opcao = select.options[select.selectedIndex];
	if(!opcao || !opcao.value) return;
	const unidade = opcao.getAttribute('data-unidade') || '';
	const tipo = opcao.getAttribute('data-tipo') || '';
	const valorref = opcao.getAttribute('data-valorref') || '';

	if(unidade.toUpperCase() !== 'HORA' && unidade.toUpperCase() !== '' && tipo.toUpperCase() !== 'FIXO'){
		// mostrar campo de duração
		document.getElementById('duracao_container').classList.remove('hidden');
		document.getElementById('duracao_unit_label').textContent = unidade.toLowerCase();
		document.getElementById('duracao_unit_text').textContent = unidade.toLowerCase();
		document.getElementById('duracao_unidade_tipo').value = unidade.toUpperCase();
	} else {
		document.getElementById('duracao_container').classList.add('hidden');
		document.getElementById('duracao_unidade').value = '';
		document.getElementById('duracao_unidade_tipo').value = '';
	}
}

async function carregarCategorias(){
	const retorno = await fetch("../php/solicitacao_categorias.php");
	const resposta = await retorno.json();
	if(resposta.status == "ok"){
		var html = '<option value="">Selecione...</option>';
		for(var i = 0; i < resposta.data.length; i++){
			html += `<option value="${resposta.data[i].id}">${resposta.data[i].nome}</option>`;
		}
		document.getElementById("categoria_id").innerHTML = html;
	}else{
		document.getElementById("categoria_id").innerHTML = '<option value="">Sem categorias disponiveis</option>';
		alert("ERRO: " + resposta.mensagem);
	}
}

async function carregarSubcategorias(){
	const categoria_id = document.getElementById("categoria_id").value;
	if(categoria_id == ""){
		document.getElementById("subcategoria_id").innerHTML = '<option value="">Selecione categoria primeiro</option>';
		return;
	}
	const retorno = await fetch("../php/solicitacao_subcategorias.php?categoria_id=" + categoria_id);
	const resposta = await retorno.json();
	if(resposta.status == "ok"){
		var html = '<option value="">Selecione...</option>';
		for(var i = 0; i < resposta.data.length; i++){
			const s = resposta.data[i];
			const unidade = s.unidade_referencia || '';
			const tipo = s.tipo_calculo || '';
			const valorref = s.valor_referencia || '';
			html += `<option value="${s.id}" data-unidade="${unidade}" data-tipo="${tipo}" data-valorref="${valorref}">${s.nome} (${s.quant_horas}h)</option>`;
		}
		document.getElementById("subcategoria_id").innerHTML = html;
	}else{
		document.getElementById("subcategoria_id").innerHTML = '<option value="">Sem subcategorias disponiveis</option>';
		alert("ERRO: " + resposta.mensagem);
	}
}

function preencherCategoriaSelecionada(){
	const select = document.getElementById("subcategoria_id");
	const opcao = select.options[select.selectedIndex];
	if(opcao && opcao.value != ""){
		document.getElementById("categoria_nome").value = opcao.getAttribute("data-categoria") || "";
	}else{
		document.getElementById("categoria_nome").value = "";
	}
}

async function novo(){
	var subcategoria_id  = document.getElementById("subcategoria_id").value;
	var horas_brutas     = document.getElementById("horas_brutas").value;
	var duracao_unidade  = document.getElementById("duracao_unidade").value;
	var duracao_unidade_tipo = document.getElementById("duracao_unidade_tipo").value;
	var justificativa    = document.getElementById("justificativa").value;

	const fd = new FormData();
	fd.append("subcategoria_id", subcategoria_id);
	fd.append("horas_brutas", horas_brutas);
	if(duracao_unidade && duracao_unidade_tipo){
		fd.append("duracao_unidade", duracao_unidade);
		fd.append("duracao_unidade_tipo", duracao_unidade_tipo);
	}
	fd.append("justificativa", justificativa);

	const arquivo = document.getElementById("arquivo").files[0];
	if(arquivo){
		fd.append("arquivo", arquivo);
	}

	const retorno = await fetch("../php/solicitacao_novo.php", {
		method: "POST",
		body: fd
	});
	const resposta = await retorno.json();

	if(resposta.status == "ok"){
		alert("SUCESSO: " + resposta.mensagem);
			window.location.href = "../solicitacao_index.html";
	}else{
		alert("ERRO: " + resposta.mensagem);
	}
}
