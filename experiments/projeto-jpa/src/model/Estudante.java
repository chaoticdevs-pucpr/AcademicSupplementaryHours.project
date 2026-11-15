package model;

import java.time.LocalDateTime;
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
@Table(name = "estudante")
public class Estudante {

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
    @JoinColumn(name = "administrador_id")
    private Administrador cadastradoPorAdministrador;

    @OneToMany(mappedBy = "estudante")
    private List<Atividade> atividades = new ArrayList<>();

    public Estudante() {
    }

    public Estudante(String nome, String cpf, String email, String senha, String celular, String telefone,
            String status) {
        this.nome = nome;
        this.cpf = cpf;
        this.email = email;
        this.senha = senha;
        this.celular = celular;
        this.telefone = telefone;
        this.status = status;
    }

    public Double visualizarHorasComplementares(EntityManager em) {
        exigirEstudanteGerenciado(em);
        Double total = em.createQuery(
                "select sum(a.horasValidadas) from Atividade a "
                        + "where a.estudante.id = :id and a.status = :status",
                Double.class)
                .setParameter("id", id)
                .setParameter("status", "APROVADO")
                .getSingleResult();
        return total == null ? 0.0 : total;
    }

    public Atividade enviarSolicitacao(EntityManager em, Double totalHoras, String categoria,
            String arquivoAnexo, Turma turma) {
        exigirEstudanteGerenciado(em);
        if (totalHoras == null || !Double.isFinite(totalHoras) || totalHoras <= 0
                || categoria == null || categoria.trim().isEmpty()
                || arquivoAnexo == null || arquivoAnexo.trim().isEmpty()) {
            throw new IllegalArgumentException("Informe horas positivas, categoria e caminho do arquivo.");
        }
        if (turma != null && !em.contains(turma)) {
            throw new IllegalStateException("A turma precisa estar persistida.");
        }

        Atividade atividade = new Atividade(LocalDateTime.now(), totalHoras, 0.0,
                "PENDENTE", null, categoria, arquivoAnexo);
        atividade.setEstudante(this);
        atividade.setTurma(turma);
        em.persist(atividade);
        return atividade;
    }

    private void exigirEstudanteGerenciado(EntityManager em) {
        if (em == null || !em.contains(this) || id == null) {
            throw new IllegalStateException("O estudante precisa estar persistido e gerenciado.");
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
            anterior.getEstudantes().remove(this);
        }
        if (administrador != null && !administrador.getEstudantes().contains(this)) {
            administrador.getEstudantes().add(this);
        }
    }

    public List<Atividade> getAtividades() {
        return atividades;
    }
}
