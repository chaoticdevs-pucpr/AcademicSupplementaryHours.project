package model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "atividade")
public class Atividade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime data;
    private Double horasBrutas;
    private Double horasValidadas;
    private String status;
    private String justificativa;
    private String categoria;
    private String arquivoAnexo;

    @ManyToOne
    @JoinColumn(name = "professor_validador_id")
    private ProfessorValidador professorValidador;

    @ManyToOne
    @JoinColumn(name = "turma_id")
    private Turma turma;

    public Atividade() {
    }

    public Atividade(LocalDateTime data, Double horasBrutas, Double horasValidadas,
            String status, String justificativa, String categoria, String arquivoAnexo) {
        this.data = data;
        this.horasBrutas = horasBrutas;
        this.horasValidadas = horasValidadas;
        this.status = status;
        this.justificativa = justificativa;
        this.categoria = categoria;
        this.arquivoAnexo = arquivoAnexo;
    }

    public boolean isPendente() {
        return "PENDENTE".equalsIgnoreCase(this.status);
    }

    public void aprovar(Double horasValidadas) {
        this.horasValidadas = horasValidadas;
        this.status = "APROVADO";
        this.justificativa = null;
    }

    public void recusar(String justificativa) {
        this.horasValidadas = 0.0;
        this.status = "RECUSADO";
        this.justificativa = justificativa;
    }

    public void anexarArquivo(String arquivoAnexo) {
        this.arquivoAnexo = arquivoAnexo;
    }

    public void removerAnexo() {
        this.arquivoAnexo = null;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getData() {
        return data;
    }

    public void setData(LocalDateTime data) {
        this.data = data;
    }

    public Double getHorasBrutas() {
        return horasBrutas;
    }

    public void setHorasBrutas(Double horasBrutas) {
        this.horasBrutas = horasBrutas;
    }

    public Double getHorasValidadas() {
        return horasValidadas;
    }

    public void setHorasValidadas(Double horasValidadas) {
        this.horasValidadas = horasValidadas;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getJustificativa() {
        return justificativa;
    }

    public void setJustificativa(String justificativa) {
        this.justificativa = justificativa;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public String getArquivoAnexo() {
        return arquivoAnexo;
    }

    public void setArquivoAnexo(String arquivoAnexo) {
        this.arquivoAnexo = arquivoAnexo;
    }

    public ProfessorValidador getProfessorValidador() {
        return professorValidador;
    }

    public void setProfessorValidador(ProfessorValidador professorValidador) {
        if (this.professorValidador == professorValidador) {
            return;
        }
        ProfessorValidador professorAnterior = this.professorValidador;
        this.professorValidador = professorValidador;
        if (professorAnterior != null) {
            professorAnterior.getAtividades().remove(this);
        }
        if (professorValidador != null && !professorValidador.getAtividades().contains(this)) {
            professorValidador.getAtividades().add(this);
        }
    }

    public Turma getTurma() {
        return turma;
    }

    public void setTurma(Turma turma) {
        this.turma = turma;
    }
}
