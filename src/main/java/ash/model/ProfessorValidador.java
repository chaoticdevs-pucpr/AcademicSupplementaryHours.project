package ash.model;

import java.util.Arrays;

public class ProfessorValidador extends Usuario implements CadastroItem {
    private String cndb;
    private String matriculaInstitucional;
    public ProfessorValidador() {
    }

    public String getCndb() {
        return cndb;
    }

    public void setCndb(String cndb) {
        this.cndb = cndb;
    }

    public String getMatriculaInstitucional() {
        return matriculaInstitucional;
    }

    public void setMatriculaInstitucional(String matriculaInstitucional) {
        this.matriculaInstitucional = matriculaInstitucional;
    }

    // metodos das interface, usando super e puxando os dados de usuario para nao reescrever tudo
    @Override
    public String[] nomeCampos(){
        String[] camposUsuario = super.nomeCampos();
        String[] camposProfessorValiddador = Arrays.copyOf(camposUsuario,camposUsuario.length + 2);
        camposProfessorValiddador[camposProfessorValiddador.length -2] = "CNDB";
        camposProfessorValiddador[camposProfessorValiddador.length -1] = "Matricula institucional";
        return camposProfessorValiddador;
    }

    @Override
    public String[]valoresCampos(){
        String[] valoresUsuario = super.valoresCampos();
        String[] camposProfessorValiddador = Arrays.copyOf(valoresUsuario, valoresUsuario.length + 2);
        camposProfessorValiddador[camposProfessorValiddador.length -2] = cndb;
        camposProfessorValiddador[camposProfessorValiddador.length -1] = matriculaInstitucional;

        return camposProfessorValiddador;
    }

    @Override
    public void preencherCampos(String[] valores){
        super.preencherCampos(valores);
        this.cndb = valores[valores.length - 2];
        this.matriculaInstitucional = valores[valores.length - 1];

    }

    @Override
    public String textoLista() {
        return super.textoLista() + getCndb() + getMatriculaInstitucional() ;
    }
}

