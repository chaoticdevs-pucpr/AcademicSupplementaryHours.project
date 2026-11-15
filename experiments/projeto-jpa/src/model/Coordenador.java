package model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.EntityManager;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "coordenador")
public class Coordenador {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String cpf;
    private String email;
    private String senha;
    private String celular;
    private String telefone;
    private String status;

    @ManyToOne
    @JoinColumn(name = "curso_id")
    private Curso curso;

    @ManyToOne
    @JoinColumn(name = "administrador_id")
    private Administrador cadastradoPorAdministrador;

    @OneToMany(mappedBy = "coordenador")
    private List<ProfessorValidador> professoresValidadores = new ArrayList<>();

    public Coordenador() {
    }

    public Coordenador(String nome, String cpf, String email, String senha, String celular, String telefone,
            String status) {
        this.nome = nome;
        this.cpf = cpf;
        this.email = email;
        this.senha = senha;
        this.celular = celular;
        this.telefone = telefone;
        this.status = status;
    }

    public Coordenador(String nome, String cpf, String email, String senha, String celular, String telefone,
            String status, Curso curso) {
        this(nome, cpf, email, senha, celular, telefone, status);
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
        return professor;
    }

    public void realizarLogin() {
        System.out.println("Login realizado pelo coordenador: " + email);
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

    public String getCelular() {
        return celular;
    }

    public void setCelular(String celular) {
        this.celular = celular;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
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
