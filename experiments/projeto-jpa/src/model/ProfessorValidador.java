package model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "professor_validador")
public class ProfessorValidador extends Usuario {

    private String matriculaInstitucional;
    private String cndb;

    @ManyToOne
    @JoinColumn(name = "coordenador_id")
    private Coordenador coordenador;

    @OneToMany(mappedBy = "professorValidador")
    private List<Atividade> atividades = new ArrayList<>();

    public ProfessorValidador() {
        super();
    }

    public ProfessorValidador(String nome, String cpf, String email, String senha, String status,
            String matriculaInstitucional, String cndb) {
        super(nome, cpf, email, senha, null, null, status);
        this.matriculaInstitucional = matriculaInstitucional;
        this.cndb = cndb;
    }

    public ProfessorValidador(String nome, String cpf, String email, String senha,
            String celular, String telefone, String status,
            String matriculaInstitucional, String cndb) {
        super(nome, cpf, email, senha, celular, telefone, status);
        this.matriculaInstitucional = matriculaInstitucional;
        this.cndb = cndb;
    }

    @Override
    public void realizarLogin() {
        System.out.println("Login realizado pelo professor validador: " + getEmail());
    }

    public void listarAtividadesTurma() {
    }

    public void aprovarAtividade(Atividade atividade, Double horasValidadas) {
        if (atividade != null) {
            atividade.setProfessorValidador(this);
            atividade.aprovar(horasValidadas);
        }
    }

    public void recusarAtividade(Atividade atividade, String justificativa) {
        if (atividade != null) {
            atividade.setProfessorValidador(this);
            atividade.recusar(justificativa);
        }
    }

    public String getMatriculaInstitucional() {
        return matriculaInstitucional;
    }

    public void setMatriculaInstitucional(String matriculaInstitucional) {
        this.matriculaInstitucional = matriculaInstitucional;
    }

    public String getCndb() {
        return cndb;
    }

    public void setCndb(String cndb) {
        this.cndb = cndb;
    }

    public Coordenador getCoordenador() {
        return coordenador;
    }

    public void setCoordenador(Coordenador coordenador) {
        if (this.coordenador == coordenador) {
            return;
        }
        Coordenador coordenadorAnterior = this.coordenador;
        this.coordenador = coordenador;
        if (coordenadorAnterior != null) {
            coordenadorAnterior.getProfessoresValidadores().remove(this);
        }
        if (coordenador != null && !coordenador.getProfessoresValidadores().contains(this)) {
            coordenador.getProfessoresValidadores().add(this);
        }
    }

    public List<Atividade> getAtividades() {
        return atividades;
    }
}
