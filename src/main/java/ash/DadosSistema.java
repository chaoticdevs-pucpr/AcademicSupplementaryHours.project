package ash;

import ash.model.Administrador;
import ash.model.CadastroItem;

import java.io.Serializable;
import java.util.ArrayList;

public class DadosSistema implements Serializable {

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

    public DadosSistema() {
        Administrador adminPadrao = new Administrador();
        adminPadrao.setId(1);
        adminPadrao.setNome("Administrador");
        adminPadrao.setEmail("admin@ash.com");
        adminPadrao.setSenha("1234");
        adminPadrao.setStatus("Ativo");

        this.administradores.add(adminPadrao);
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

    // --- SETTERS (Adicionados para a nova persistência) ---
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

    public ArrayList<CadastroItem> getSubcategorias() {
        if (subcategorias == null) subcategorias = new ArrayList<>();
        return subcategorias;
    }
 
    public ArrayList<CadastroItem> getJustificativasAceite() {
        if (justificativasAceite == null) justificativasAceite = new ArrayList<>();
        return justificativasAceite;
    }

    // --- LÓGICA ---
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