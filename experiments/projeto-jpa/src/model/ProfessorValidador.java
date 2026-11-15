package model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "professor_validador")
public class ProfessorValidador {

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
    private String matriculaInstitucional;
    private String cndb;

    @OneToMany(mappedBy = "professorValidador")
    private List<Atividade> atividades = new ArrayList<>();

    public ProfessorValidador() {
    }

    public ProfessorValidador(String nome, String cpf, String email, String senha, String status,
            String matriculaInstitucional, String cndb) {
        this.nome = nome;
        this.cpf = cpf;
        this.email = email;
        this.senha = senha;
        this.status = status;
        this.matriculaInstitucional = matriculaInstitucional;
        this.cndb = cndb;
    }

    public ProfessorValidador(String nome, String cpf, String email, String senha,
            String celular, String telefone, String status,
            String matriculaInstitucional, String cndb) {
        this.nome = nome;
        this.cpf = cpf;
        this.email = email;
        this.senha = senha;
        this.celular = celular;
        this.telefone = telefone;
        this.status = status;
        this.matriculaInstitucional = matriculaInstitucional;
        this.cndb = cndb;
    }

    public void realizarLogin() {
        System.out.println("Login realizado pelo professor validador: " + this.email);
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

    public List<Atividade> getAtividades() {
        return atividades;
    }
}
