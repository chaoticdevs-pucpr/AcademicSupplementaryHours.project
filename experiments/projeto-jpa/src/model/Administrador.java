package model;

import jakarta.persistence.Entity;
import jakarta.persistence.EntityManager;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "administrador")
public class Administrador {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String cpf;
    private String email;
    private String senha;
    private String status;

    @OneToOne
    @JoinColumn(name = "curso_id", unique = true)
    private Curso curso;

    @OneToOne(mappedBy = "administrador")
    private Turma turma;

    public Administrador() {
    }

    public Administrador(String nome, String cpf, String email, String senha, String status) {
        this.nome = nome;
        this.cpf = cpf;
        this.email = email;
        this.senha = senha;
        this.status = status;
    }

    public void realizarLogin() {
        System.out.println("Login realizado pelo administrador: " + this.email);
    }

    public void cadastrarCurso() {
    }

    public void alterarCurso() {
    }

    public void excluirCurso() {
    }

    public Turma cadastrarTurma(EntityManager em, String nome, Curso curso) {
        if (turma != null) {
            throw new IllegalStateException("Este administrador já possui uma turma.");
        }
        if (!em.contains(this)) {
            throw new IllegalStateException("O administrador precisa estar persistido.");
        }
        if (curso != null && !em.contains(curso)) {
            throw new IllegalStateException("O curso precisa estar persistido.");
        }

        Turma novaTurma = new Turma(nome);
        novaTurma.setAdministrador(this);
        novaTurma.setCurso(curso);
        setTurma(novaTurma);
        em.persist(novaTurma);
        return novaTurma;
    }

    public void alterarTurma(EntityManager em, String nome, Curso curso) {
        Turma turmaAtual = obterTurmaGerenciada(em);
        if (curso != null && !em.contains(curso)) {
            throw new IllegalStateException("O curso precisa estar persistido.");
        }

        turmaAtual.setNome(nome);
        turmaAtual.setCurso(curso);
    }

    public void excluirTurma(EntityManager em) {
        Turma turmaAtual = obterTurmaGerenciada(em);
        turmaAtual.setAdministrador(null);
        turmaAtual.setCurso(null);
        em.remove(turmaAtual);
        turma = null;
    }

    private Turma obterTurmaGerenciada(EntityManager em) {
        if (turma == null || turma.getId() == null) {
            throw new IllegalStateException("Este administrador não possui uma turma cadastrada.");
        }

        Turma turmaAtual = em.find(Turma.class, turma.getId());
        if (turmaAtual == null || turmaAtual.getAdministrador() == null
                || !getId().equals(turmaAtual.getAdministrador().getId())) {
            throw new IllegalStateException("A turma não pertence a este administrador.");
        }
        return turmaAtual;
    }

    public void cadastrarEstudante() {
    }

    public void alterarEstudante() {
    }

    public void excluirEstudante() {
    }

    public void cadastrarCoordenador() {
    }

    public void alterarCoordenador() {
    }

    public void excluirCoordenador() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Curso getCurso() {
        return curso;
    }

    public void setCurso(Curso curso) {
        this.curso = curso;
    }

    public Turma getTurma() {
        return turma;
    }

    public void setTurma(Turma turma) {
        if (this.turma == turma) {
            return;
        }
        Turma turmaAnterior = this.turma;
        this.turma = turma;
        if (turmaAnterior != null && turmaAnterior.getAdministrador() == this) {
            turmaAnterior.setAdministrador(null);
        }
        if (turma != null && turma.getAdministrador() != this) {
            turma.setAdministrador(this);
        }
    }
}
