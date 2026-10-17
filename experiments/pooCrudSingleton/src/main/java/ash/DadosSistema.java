package ash;

import ash.model.Administrador;
import ash.model.CadastroItem;
import ash.model.Coordenador;
import ash.model.Estudante;
import ash.model.ProfessorValidador;

import java.io.Serializable;
import java.util.ArrayList;

public class DadosSistema implements Serializable {
    private static final long serialVersionUID = 1L;

    // --- SINGLETON ---
    private static DadosSistema instancia;

    // --- COLEÇÕES / DADOS ---
    private ArrayList<CadastroItem> coordenadores = new ArrayList<>();
    private ArrayList<CadastroItem> estudantes = new ArrayList<>();
    private ArrayList<Administrador> administradores = new ArrayList<>();
    private ArrayList<CadastroItem> solicitacao = new ArrayList<>();
    private ArrayList<CadastroItem> sugestao = new ArrayList<>();
    private ArrayList<CadastroItem> professorValidador = new ArrayList<>();
    private ArrayList<CadastroItem> evento = new ArrayList<>();
    private ArrayList<CadastroItem> cursos = new ArrayList<>();
    private ArrayList<CadastroItem> turmas = new ArrayList<>();
    private ArrayList<CadastroItem> manual = new ArrayList<>();
    private ArrayList<CadastroItem> categorias = new ArrayList<>();
    private ArrayList<CadastroItem> subcategorias = new ArrayList<>();
    private ArrayList<CadastroItem> justificativasAceite = new ArrayList<>();

    // --- CONSTRUTOR ---
    private DadosSistema() {
        Administrador adminPadrao = new Administrador();
        adminPadrao.setId(1);
        adminPadrao.setNome("Administrador");
        adminPadrao.setEmail("admin@ash.com");
        adminPadrao.setSenha("1234");
        adminPadrao.setStatus("Ativo");

        this.administradores.add(adminPadrao);
    }

    // --- ACESSO GLOBAL ---
    public static synchronized DadosSistema getInstancia() {
        if (instancia == null) {
            instancia = new DadosSistema();
            ArquivoDados.carregarPara(instancia);
        }
        return instancia;
    }

    public static DadosSistema getInstance() {
        return getInstancia();
    }

    // --- PERSISTÊNCIA ---
    public void salvar() {
        ArquivoDados.salvar(this);
    }

    // --- BUSCAS E CONSULTAS ---
    public String autenticarUsuario(String email, String senha) {
        if (email == null || senha == null) {
            return null;
        }

        for (Administrador admin : administradores) {
            if (admin.getEmail().equalsIgnoreCase(email) && admin.getSenha().equals(senha)) {
                return "Administrador";
            }
        }

        if (estudantes != null) {
            for (CadastroItem item : estudantes) {
                if (item instanceof Estudante estudante) {
                    if (estudante.getEmail().equalsIgnoreCase(email) && estudante.getSenha().equals(senha)) {
                        return "Estudante";
                    }
                }
            }
        }

        if (coordenadores != null) {
            for (CadastroItem item : coordenadores) {
                if (item instanceof Coordenador coordenador) {
                    if (coordenador.getEmail().equalsIgnoreCase(email) && coordenador.getSenha().equals(senha)) {
                        return "Coordenador";
                    }
                }
            }
        }

        if (professorValidador != null) {
            for (CadastroItem item : professorValidador) {
                if (item instanceof ProfessorValidador professor) {
                    if (professor.getEmail().equalsIgnoreCase(email) && professor.getSenha().equals(senha)) {
                        return "Professor Validador";
                    }
                }
            }
        }

        return null;
    }

    public ArrayList<String> buscarNomesCursos() {
        ArrayList<String> nomes = new ArrayList<>();
        for (CadastroItem item : cursos) {
            String[] nomesCampos = item.nomeCampos();
            String[] valores = item.valoresCampos();
            int index = -1;
            for (int j = 0; j < nomesCampos.length; j++) {
                if (nomesCampos[j].toLowerCase().contains("nome") || nomesCampos[j].toLowerCase().equals("curso")) {
                    index = j;
                    break;
                }
            }
            if (index != -1 && valores.length > index) {
                nomes.add(valores[index]);
            } else if (valores.length > 0) {
                nomes.add(valores[0]);
            }
        }
        return nomes;
    }

    public ArrayList<String> buscarTurmasPorCurso(String cursoFiltro) {
        ArrayList<String> listaNomes = new ArrayList<>();
        for (CadastroItem turmaCadastrada : turmas) {
            String[] nomesDosCampos = turmaCadastrada.nomeCampos();
            String[] valoresDaTurma = turmaCadastrada.valoresCampos();
            int indexDoNome = -1;
            int indexDoCursoNaTurma = -1;

            for (int j = 0; j < nomesDosCampos.length; j++) {
                if (nomesDosCampos[j].toLowerCase().contains("nome") || nomesDosCampos[j].toLowerCase().equals("turma")) {
                    indexDoNome = j;
                }
                if (nomesDosCampos[j].toLowerCase().equals("curso")) {
                    indexDoCursoNaTurma = j;
                }
            }

            boolean pertenceAoCurso = true;
            if (cursoFiltro != null && indexDoCursoNaTurma != -1) {
                if (valoresDaTurma.length > indexDoCursoNaTurma) {
                    pertenceAoCurso = valoresDaTurma[indexDoCursoNaTurma].equals(cursoFiltro);
                } else {
                    pertenceAoCurso = false;
                }
            }

            if (pertenceAoCurso) {
                if (indexDoNome != -1 && valoresDaTurma.length > indexDoNome) {
                    listaNomes.add(valoresDaTurma[indexDoNome]);
                } else if (valoresDaTurma.length > 0) {
                    listaNomes.add(valoresDaTurma[0]);
                }
            }
        }
        return listaNomes;
    }

    public ArrayList<String> buscarNomesCategorias() {
        ArrayList<String> nomes = new ArrayList<>();
        for (CadastroItem catCadastrada : categorias) {
            String[] nomesDosCampos = catCadastrada.nomeCampos();
            String[] valoresDaCat = catCadastrada.valoresCampos();
            int indexDoNome = -1;
            for (int j = 0; j < nomesDosCampos.length; j++) {
                if (nomesDosCampos[j].toLowerCase().contains("nome") || nomesDosCampos[j].toLowerCase().equals("categoria")) {
                    indexDoNome = j;
                    break;
                }
            }
            if (indexDoNome != -1 && valoresDaCat.length > indexDoNome) {
                nomes.add(valoresDaCat[indexDoNome]);
            } else if (valoresDaCat.length > 0) {
                nomes.add(valoresDaCat[0]);
            }
        }
        return nomes;
    }

    public ArrayList<String> buscarSubcategoriasPorCategoria(String catFiltro) {
        ArrayList<String> listaNomes = new ArrayList<>();
        for (CadastroItem subCadastrada : subcategorias) {
            String[] nomesDosCampos = subCadastrada.nomeCampos();
            String[] valoresDaSub = subCadastrada.valoresCampos();
            int indexDoNome = -1;
            int indexDaCatNaSub = -1;

            for (int j = 0; j < nomesDosCampos.length; j++) {
                if (nomesDosCampos[j].toLowerCase().contains("nome") || nomesDosCampos[j].toLowerCase().equals("subcategoria")) {
                    indexDoNome = j;
                }
                if (nomesDosCampos[j].toLowerCase().equals("categoria")) {
                    indexDaCatNaSub = j;
                }
            }

            boolean pertenceACat = true;
            if (catFiltro != null && indexDaCatNaSub != -1) {
                if (valoresDaSub.length > indexDaCatNaSub) {
                    pertenceACat = valoresDaSub[indexDaCatNaSub].equals(catFiltro);
                } else {
                    pertenceACat = false;
                }
            }

            if (pertenceACat) {
                if (indexDoNome != -1 && valoresDaSub.length > indexDoNome) {
                    listaNomes.add(valoresDaSub[indexDoNome]);
                } else if (valoresDaSub.length > 0) {
                    listaNomes.add(valoresDaSub[0]);
                }
            }
        }
        return listaNomes;
    }

    public ArrayList<String> buscarIdentificadoresSolicitacoes() {
        ArrayList<String> listaIdentificadores = new ArrayList<>();
        for (CadastroItem solicitacaoCadastrada : solicitacao) {
            String[] valoresDaSolicitacao = solicitacaoCadastrada.valoresCampos();
            if (valoresDaSolicitacao.length > 0) {
                String identificador = "ID " + solicitacaoCadastrada.getId() + " - " + valoresDaSolicitacao[0];
                listaIdentificadores.add(identificador);
            }
        }
        return listaIdentificadores;
    }

    // --- GETTERS ---
    public ArrayList<CadastroItem> getCoordenadores() { return coordenadores; }
    public ArrayList<CadastroItem> getEstudantes() { return estudantes; }
    public ArrayList<Administrador> getAdministradores() { return administradores; }
    public ArrayList<CadastroItem> getSolicitacao() { return solicitacao; }
    public ArrayList<CadastroItem> getSugestao() { return sugestao; }
    public ArrayList<CadastroItem> getProfessorValidador() { return professorValidador; }
    public ArrayList<CadastroItem> getEvento() { return evento; }
    public ArrayList<CadastroItem> getCursos() { return cursos; }
    public ArrayList<CadastroItem> getTurmas() { return turmas; }
    public ArrayList<CadastroItem> getManual() { return manual; }
    public ArrayList<CadastroItem> getCategorias() { return categorias; }

    public ArrayList<CadastroItem> getSubcategorias() {
        if (subcategorias == null) subcategorias = new ArrayList<>();
        return subcategorias;
    }
 
    public ArrayList<CadastroItem> getJustificativasAceite() {
        if (justificativasAceite == null) justificativasAceite = new ArrayList<>();
        return justificativasAceite;
    }

    // --- SETTERS ---
    public void setCoordenadores(ArrayList<CadastroItem> coordenadores) { this.coordenadores = coordenadores; }
    public void setEstudantes(ArrayList<CadastroItem> estudantes) { this.estudantes = estudantes; }
    public void setAdministradores(ArrayList<Administrador> administradores) { this.administradores = administradores; }
    public void setSolicitacao(ArrayList<CadastroItem> solicitacao) { this.solicitacao = solicitacao; }
    public void setSugestao(ArrayList<CadastroItem> sugestao) { this.sugestao = sugestao; }
    public void setProfessorValidador(ArrayList<CadastroItem> professorValidador) { this.professorValidador = professorValidador; }
    public void setEvento(ArrayList<CadastroItem> evento) { this.evento = evento; }
    public void setCursos(ArrayList<CadastroItem> cursos) { this.cursos = cursos; }
    public void setTurmas(ArrayList<CadastroItem> turmas) { this.turmas = turmas; }
    public void setManual(ArrayList<CadastroItem> manual) { this.manual = manual; }
    public void setCategorias(ArrayList<CadastroItem> categorias) { this.categorias = categorias; }
    public void setSubcategorias(ArrayList<CadastroItem> subcategorias) { this.subcategorias = subcategorias; }
    public void setJustificativasAceite(ArrayList<CadastroItem> justificativasAceite) { this.justificativasAceite = justificativasAceite; }

    // --- LÓGICA DE ID ---
    public int proximoId(ArrayList<CadastroItem> lista) {
        int maior = 0;
        for (CadastroItem item : lista) {
            if (item.getId() > maior) {
                maior = item.getId();
            }
        }
        return maior + 1;
    }
}