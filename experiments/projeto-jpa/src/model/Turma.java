package model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "turma")
public class Turma {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    @ManyToOne
    @JoinColumn(name = "curso_id")
    private Curso curso;

    @OneToOne
    @JoinColumn(name = "administrador_id", unique = true)
    private Administrador administrador;

    public Turma() {
    }

    public Turma(String nome) {
        this.nome = nome;
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

    public Curso getCurso() {
        return curso;
    }

    public void setCurso(Curso curso) {
        if (this.curso == curso) {
            return;
        }
        Curso cursoAnterior = this.curso;
        this.curso = curso;
        if (cursoAnterior != null) {
            cursoAnterior.getTurmas().remove(this);
        }
        if (curso != null && !curso.getTurmas().contains(this)) {
            curso.getTurmas().add(this);
        }
    }

    public Administrador getAdministrador() {
        return administrador;
    }

    public void setAdministrador(Administrador administrador) {
        if (this.administrador == administrador) {
            return;
        }
        Administrador administradorAnterior = this.administrador;
        this.administrador = administrador;
        if (administradorAnterior != null && administradorAnterior.getTurma() == this) {
            administradorAnterior.setTurma(null);
        }
        if (administrador != null && administrador.getTurma() != this) {
            administrador.setTurma(this);
        }
    }
}
