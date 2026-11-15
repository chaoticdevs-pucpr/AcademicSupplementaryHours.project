package model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.EntityManager;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "estudante")
public class Estudante extends Usuario {

    private String matricula;

    @ManyToOne
    @JoinColumn(name = "administrador_id")
    private Administrador cadastradoPorAdministrador;

    @OneToMany(mappedBy = "estudante")
    private List<Atividade> atividades = new ArrayList<>();

    public Estudante() {
        super();
    }

    public Estudante(String nome, String cpf, String email, String senha, String celular, String telefone,
            String status) {
        super(nome, cpf, email, senha, celular, telefone, status);
    }

    public Estudante(String nome, String cpf, String email, String senha, String celular, String telefone,
            String status, String matricula) {
        super(nome, cpf, email, senha, celular, telefone, status);
        this.matricula = matricula;
    }

    public Double visualizarHorasComplementares(EntityManager em) {
        exigirEstudanteGerenciado(em);
        em.flush();
        Double total = em.createQuery(
                "select sum(a.horasValidadas) from Atividade a "
                        + "where a.estudante.id = :id and a.status = :status",
                Double.class)
                .setParameter("id", getId())
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
        em.flush();
        return atividade;
    }

    private void exigirEstudanteGerenciado(EntityManager em) {
        if (em == null || !em.contains(this)) {
            throw new IllegalStateException("O estudante precisa estar persistido e gerenciado.");
        }
        if (getId() == null) {
            em.flush();
        }
    }

    public String getMatricula() {
        return matricula;
    }

    public void setMatricula(String matricula) {
        this.matricula = matricula;
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
