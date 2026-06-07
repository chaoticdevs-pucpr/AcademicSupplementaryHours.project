package ash.model;

import java.util.Arrays;

public class Estudante extends Usuario {
    private String matricula;

    public Estudante() {
    }

    public String getMatricula() {
        return matricula;
    }

    public void setMatricula(String matricula) {
        this.matricula = matricula;
    }

    // metodos das interface, usando super e puxando os dados de usuario para nao reescrever tudo
    @Override
    public String[] nomeCampos(){
        String[] camposUsuario = super.nomeCampos();
        String[] camposEstudante = Arrays.copyOf(camposUsuario,camposUsuario.length + 1);
        camposEstudante[camposEstudante.length -1] = "Matricula";
        return camposEstudante;
    }

    @Override
    public String[]valoresCampos(){
        String[] valoresUsuario = super.valoresCampos();
        String[] valoresEstudante = Arrays.copyOf(valoresUsuario, valoresUsuario.length + 1);
        valoresEstudante[valoresEstudante.length -1] = matricula;
        return valoresEstudante;
    }

    @Override
    public void preencherCampos(String[] valores){
        super.preencherCampos(valores);
        this.matricula = valores[valores.length - 1];
    }

    @Override
    public String textoLista() {
        return super.textoLista() + getMatricula();
    }
}

