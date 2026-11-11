package model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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

    public void cadastrarTurma() {
    }

    public void alterarTurma() {
    }

    public void excluirTurma() {
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
}
