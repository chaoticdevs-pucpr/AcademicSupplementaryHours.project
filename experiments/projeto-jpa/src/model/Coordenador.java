package model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.EntityManager;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "coordenador")
public class Coordenador extends Usuario {

    private int cndb;

    @ManyToOne
    @JoinColumn(name = "curso_id")
    private Curso curso;

    @ManyToOne
    @JoinColumn(name = "administrador_id")
    private Administrador cadastradoPorAdministrador;

    @OneToMany(mappedBy = "coordenador")
    private List<ProfessorValidador> professoresValidadores = new ArrayList<>();

    public Coordenador() {
        super();
    }

    public Coordenador(String nome, String cpf, String email, String senha, String celular, String telefone,
            String status) {
        super(nome, cpf, email, senha, celular, telefone, status);
    }

    public Coordenador(String nome, String cpf, String email, String senha, String celular, String telefone,
            String status, Curso curso) {
        super(nome, cpf, email, senha, celular, telefone, status);
        this.curso = curso;
    }

    public Coordenador(String nome, String cpf, String email, String senha, String celular, String telefone,
            String status, int cndb, Curso curso) {
        super(nome, cpf, email, senha, celular, telefone, status);
        this.cndb = cndb;
        this.curso = curso;
    }

    public ProfessorValidador cadastrarProfessorValidador(EntityManager em, ProfessorValidador professor) {
        if (em == null || !em.contains(this)) {
            throw new IllegalStateException("O coordenador precisa estar persistido e gerenciado.");
        }
        if (professor == null || professor.getId() != null) {
            throw new IllegalArgumentException("Informe um professor validador novo.");
        }

        professor.setCoordenador(this);
        em.persist(professor);
        em.flush();
        return professor;
    }

    @Override
    public void realizarLogin() {
        System.out.println("Login realizado pelo coordenador: " + getEmail());
    }

    public int getCndb() {
        return cndb;
    }

    public void setCndb(int cndb) {
        this.cndb = cndb;
    }

    public Curso getCurso() {
        return curso;
    }

    public void setCurso(Curso curso) {
        this.curso = curso;
    }

    public Administrador getCadastradoPorAdministrador() {
        return cadastradoPorAdministrador;
    }

    public void setCadastradoPorAdministrador(Administrador administrador) {
        if (this.cadastradoPorAdministrador == administrador) {
            return;
        }
        Administrador anterior = this.cadastradoPorAdministrador;
        this.cadastradoPorAdministrador = administrador;
        if (anterior != null) {
            anterior.getCoordenadores().remove(this);
        }
        if (administrador != null && !administrador.getCoordenadores().contains(this)) {
            administrador.getCoordenadores().add(this);
        }
    }

    public List<ProfessorValidador> getProfessoresValidadores() {
        return professoresValidadores;
    }
}
