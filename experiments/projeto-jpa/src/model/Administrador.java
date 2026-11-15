package model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.EntityManager;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
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

    @OneToMany(mappedBy = "cadastradoPorAdministrador")
    private List<Estudante> estudantes = new ArrayList<>();

    @OneToMany(mappedBy = "cadastradoPorAdministrador")
    private List<Coordenador> coordenadores = new ArrayList<>();

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

    public Estudante cadastrarEstudante(EntityManager em, Estudante estudante) {
        exigirAdministradorGerenciado(em);
        if (estudante == null || estudante.getId() != null) {
            throw new IllegalArgumentException("Informe um estudante novo.");
        }

        estudante.setCadastradoPorAdministrador(this);
        em.persist(estudante);
        return estudante;
    }

    public void alterarEstudante(EntityManager em, Long estudanteId, Estudante dados) {
        exigirAdministradorGerenciado(em);
        if (dados == null) {
            throw new IllegalArgumentException("Informe os dados do estudante.");
        }

        Estudante estudante = em.find(Estudante.class, estudanteId);
        if (estudante == null || estudante.getCadastradoPorAdministrador() == null
                || !getId().equals(estudante.getCadastradoPorAdministrador().getId())) {
            throw new IllegalArgumentException("Estudante não encontrado para este administrador.");
        }

        estudante.setNome(dados.getNome());
        estudante.setCpf(dados.getCpf());
        estudante.setEmail(dados.getEmail());
        estudante.setSenha(dados.getSenha());
        estudante.setCelular(dados.getCelular());
        estudante.setTelefone(dados.getTelefone());
        estudante.setStatus(dados.getStatus());
    }

    public void excluirEstudante(EntityManager em, Long estudanteId) {
        exigirAdministradorGerenciado(em);
        Estudante estudante = em.find(Estudante.class, estudanteId);
        if (estudante == null || estudante.getCadastradoPorAdministrador() == null
                || !getId().equals(estudante.getCadastradoPorAdministrador().getId())) {
            throw new IllegalArgumentException("Estudante não encontrado para este administrador.");
        }
        if (contarRelacionamentos(em, "select count(a) from Atividade a where a.estudante.id = :id",
                estudanteId) > 0) {
            throw new IllegalStateException("Não é possível excluir um estudante com solicitações cadastradas.");
        }

        estudantes.remove(estudante);
        em.remove(estudante);
    }

    public Coordenador cadastrarCoordenador(EntityManager em, Coordenador coordenador) {
        exigirAdministradorGerenciado(em);
        if (coordenador == null || coordenador.getId() != null) {
            throw new IllegalArgumentException("Informe um coordenador novo.");
        }
        if (coordenador.getCurso() != null && !em.contains(coordenador.getCurso())) {
            throw new IllegalStateException("O curso precisa estar persistido.");
        }

        coordenador.setCadastradoPorAdministrador(this);
        em.persist(coordenador);
        return coordenador;
    }

    public void alterarCoordenador(EntityManager em, Long coordenadorId, Coordenador dados) {
        exigirAdministradorGerenciado(em);
        if (dados == null) {
            throw new IllegalArgumentException("Informe os dados do coordenador.");
        }

        Coordenador coordenador = em.find(Coordenador.class, coordenadorId);
        if (coordenador == null || coordenador.getCadastradoPorAdministrador() == null
                || !getId().equals(coordenador.getCadastradoPorAdministrador().getId())) {
            throw new IllegalArgumentException("Coordenador não encontrado para este administrador.");
        }
        if (dados.getCurso() != null && !em.contains(dados.getCurso())) {
            throw new IllegalStateException("O curso precisa estar persistido.");
        }

        coordenador.setNome(dados.getNome());
        coordenador.setCpf(dados.getCpf());
        coordenador.setEmail(dados.getEmail());
        coordenador.setSenha(dados.getSenha());
        coordenador.setCelular(dados.getCelular());
        coordenador.setTelefone(dados.getTelefone());
        coordenador.setStatus(dados.getStatus());
        coordenador.setCurso(dados.getCurso());
    }

    public void excluirCoordenador(EntityManager em, Long coordenadorId) {
        exigirAdministradorGerenciado(em);
        Coordenador coordenador = em.find(Coordenador.class, coordenadorId);
        if (coordenador == null || coordenador.getCadastradoPorAdministrador() == null
                || !getId().equals(coordenador.getCadastradoPorAdministrador().getId())) {
            throw new IllegalArgumentException("Coordenador não encontrado para este administrador.");
        }
        if (contarRelacionamentos(em,
                "select count(p) from ProfessorValidador p where p.coordenador.id = :id", coordenadorId) > 0) {
            throw new IllegalStateException("Não é possível excluir um coordenador com professores cadastrados.");
        }

        coordenadores.remove(coordenador);
        em.remove(coordenador);
    }

    private void exigirAdministradorGerenciado(EntityManager em) {
        if (em == null || !em.contains(this)) {
            throw new IllegalStateException("O administrador precisa estar persistido e gerenciado.");
        }
    }

    private long contarRelacionamentos(EntityManager em, String jpql, Long id) {
        return em.createQuery(jpql, Long.class)
                .setParameter("id", id)
                .getSingleResult();
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

    public List<Estudante> getEstudantes() {
        return estudantes;
    }

    public List<Coordenador> getCoordenadores() {
        return coordenadores;
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
