document.addEventListener("DOMContentLoaded", async () => {
    valida_sessao('ESTUDANTE');
    await carregarCategorias();

    const url = new URLSearchParams(window.location.search);
    const id = url.get("id");
    if(id){
        await buscar(id);
    }else{
        alert("ID não informado.");
        window.location.href = "../solicitacao_index.html";
    }
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
    alterar();
});

document.getElementById("categoria_id").addEventListener("change", () => {
    carregarSubcategorias();
});

document.getElementById("subcategoria_id").addEventListener("change", () => {
});

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

    // File selector management for alterar page (preserve previous selections)
    let _dt_files_alterar = new DataTransfer();
    function initFileSelectorAlterar(){
        const input = document.getElementById('arquivo');
        const list = document.getElementById('selected-files-list');
        if(!input || !list) return;
        input.addEventListener('change', (e) => {
            const newFiles = Array.from(e.target.files || []);
            const dt = new DataTransfer();
            const removed = [];

            // add existing files first
            Array.from(_dt_files_alterar.files || []).forEach(f => dt.items.add(f));

            const exists = (file) => {
                for(const ofile of dt.files){
                    if(ofile.name === file.name && ofile.size === file.size) return true;
                }
                return false;
            }

            newFiles.forEach(f => {
                const ext = (f.name.split('.').pop() || '').toLowerCase();
                const allowed = ext === 'pdf' && f.type === 'application/pdf';
                if(!allowed){ removed.push(f.name); return; }
                if(!exists(f) && dt.files.length < 5) dt.items.add(f);
            });

            _dt_files_alterar = dt;
            input.files = _dt_files_alterar.files;

            const files = Array.from(input.files || []);
            if(files.length === 0){
                list.innerHTML = '<p class="text-xs text-slate-400 italic">Nenhum arquivo selecionado</p>';
                if(removed.length > 0) alert('Removido(s) arquivo(s) não permitido(s): ' + removed.join(', '));
                return;
            }
            list.innerHTML = '';
            files.forEach((f, idx) => {
                const ext = (f.name.split('.').pop() || '').toLowerCase();
                const allowed = ext === 'pdf' && f.type === 'application/pdf';
                const row = document.createElement('div');
                row.className = 'flex items-center justify-between gap-3 py-1';

                const left = document.createElement('div');
                left.className = 'flex items-center gap-2';
                left.innerHTML = `
                    <i data-lucide="paperclip" class="w-4 h-4 text-slate-400"></i>
                    <span class="text-sm ${allowed? 'text-indigo-700' : 'text-rose-600'} truncate">${f.name}</span>
                `;

                const right = document.createElement('div');
                right.className = 'flex items-center gap-2';
                if(!allowed){
                    right.innerHTML = '<span class="text-xs text-rose-600 mr-2">Tipo não permitido</span>';
                }
                const removeButton = document.createElement('button');
                removeButton.type = 'button';
                removeButton.className = 'text-xs text-slate-500 hover:text-slate-900';
                removeButton.textContent = 'Remover';
                removeButton.style.position = 'relative';
                removeButton.style.zIndex = '60';
                removeButton.addEventListener('click', (ev) => {
                    ev.preventDefault();
                    ev.stopPropagation();
                    removeSelectedFileAlterar(ev, idx);
                });
                right.appendChild(removeButton);

                row.appendChild(left);
                row.appendChild(right);
                list.appendChild(row);
            });
            if(window.lucide) lucide.createIcons();
             if(newFiles.length > 5) alert('Apenas 5 anexos são permitidos por solicitação.');
             if(removed.length > 0) alert('Removido(s) arquivo(s) não permitido(s): ' + removed.join(', '));
         });
    }

    function removeSelectedFileAlterar(e, index){
        if(e && typeof e.stopPropagation === 'function'){ e.stopPropagation(); e.preventDefault(); }
        const input = document.getElementById('arquivo');
        if(!input) return;
        const dt = new DataTransfer();
        const files = Array.from(_dt_files_alterar.files || []);
        files.splice(index,1);
        files.forEach(f => dt.items.add(f));
        _dt_files_alterar = dt;
        input.files = _dt_files_alterar.files;
        // re-render
        const ev = new Event('change');
        input.dispatchEvent(ev);
    }

    // init directly (DOMContentLoaded already fired)
    initFileSelectorAlterar();
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
            html += `<option value="${resposta.data[i].id}">${resposta.data[i].nome} (${resposta.data[i].quant_pontos} pontos)</option>`;
        }
        document.getElementById("subcategoria_id").innerHTML = html;
    }else{
        document.getElementById("subcategoria_id").innerHTML = '<option value="">Sem subcategorias disponiveis</option>';
        alert("ERRO: " + resposta.mensagem);
    }
}


async function buscar(id){
    const retorno = await fetch("../php/solicitacao_get.php?id=" + id);
    const resposta = await retorno.json();
    if(resposta.status == "ok"){
        const r = resposta.data[0];
        if((r.status || '').toUpperCase() !== 'PENDENTE'){
            alert('Esta solicitação já foi ' + r.status.toLowerCase() + ' e não pode ser alterada.');
            window.location.href = "../solicitacao_index.html";
            return;
        }
        document.getElementById("id").value = r.id;
        document.getElementById("categoria_id").value = r.categoria_id;
        await carregarSubcategorias();
        document.getElementById("subcategoria_id").value = r.subcategoria_id;
        document.getElementById("horas_brutas").value = r.horas_brutas;
        document.getElementById("justificativa").value = r.justificativa;
    }else{
        alert(resposta.mensagem);
        window.location.href = "../solicitacao_index.html";
    }
}

async function alterar(){
    var id              = document.getElementById("id").value;
    var subcategoria_id = document.getElementById("subcategoria_id").value;
    var horas_brutas    = document.getElementById("horas_brutas").value;
    var justificativa   = document.getElementById("justificativa").value;

    const fd = new FormData();
    fd.append("id", id);
    fd.append("subcategoria_id", subcategoria_id);
    fd.append("horas_brutas", horas_brutas);
    fd.append("justificativa", justificativa);

    const arquivos = document.getElementById("arquivo").files;
    if(arquivos.length > 5){
        alert('Você pode enviar no máximo 5 anexos por solicitação.');
        return;
    }
    if(arquivos.length > 0){
        const arquivo = arquivos[0];
        const ext = (arquivo.name.split('.').pop() || '').toLowerCase();
        if(ext !== 'pdf' || arquivo.type !== 'application/pdf'){
            alert('Apenas arquivo PDF é permitido.');
            return;
        }
    }
    for(const arquivo of arquivos){
        fd.append("arquivo[]", arquivo);
    }

    const retorno = await fetch("../php/solicitacao_alterar.php?id=" + id, {
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
