package ash.model;

import java.util.Arrays;

public class Estudante extends Usuario {
    private String matricula;
    private String curso;
    private String turma;

    public Estudante() {
    }

    public String getMatricula() {
        return matricula;
    }

    public void setMatricula(String matricula) {
        this.matricula = matricula;
    }

    public String getCurso() {
        return curso;
    }

    public void setCurso(String curso) {
        this.curso = curso;
    }

    public String getTurma() {
        return turma;
    }

    public void setTurma(String turma) {
        this.turma = turma;
    }
    
    @Override
    public String[] nomeCampos() {
        String[] camposUsuario = super.nomeCampos();
        String[] camposEstudante = Arrays.copyOf(camposUsuario, camposUsuario.length + 3);
        camposEstudante[camposEstudante.length - 3] = "Matricula";
        camposEstudante[camposEstudante.length - 2] = "Curso";
        camposEstudante[camposEstudante.length - 1] = "Turma";
        return camposEstudante;
    }

    @Override
    public String[] valoresCampos() {
        String[] valoresUsuario = super.valoresCampos();
        String[] valoresEstudante = Arrays.copyOf(valoresUsuario, valoresUsuario.length + 3);
        valoresEstudante[valoresEstudante.length - 3] = matricula;
        valoresEstudante[valoresEstudante.length - 2] = curso;
        valoresEstudante[valoresEstudante.length - 1] = turma;
        return valoresEstudante;
    }

    @Override
    public void preencherCampos(String[] valores) {
        super.preencherCampos(valores);
        this.matricula = valores[valores.length - 3];
        this.curso = valores[valores.length - 2];
        this.turma = valores[valores.length - 1];
    }

    @Override
    public String textoLista() {
        return super.textoLista() + " - " + getMatricula() + " - " + getCurso() + " - " + getTurma();
    }
}