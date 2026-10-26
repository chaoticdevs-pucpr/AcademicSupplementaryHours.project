package ash.model;

import java.util.Arrays;

public class Coordenador extends Usuario {
    private int cndb;

    public  Coordenador(){
    }

    public int getCndb() {
        return cndb;
    }

    public void setCndb(int cndb) {
        this.cndb = cndb;
    }

// metodos das interface, usando super e puxando os dados de usuario para nao reescrever tudo
    @Override
    public String[] nomeCampos(){
    String[] camposUsuario = super.nomeCampos();
    String[] camposCoordenador = Arrays.copyOf(camposUsuario,camposUsuario.length + 1);
    camposCoordenador[camposCoordenador.length -1] = "CNDB";
    return camposCoordenador;
    }

    @Override
    public String[]valoresCampos(){
        String[] valoresUsuario = super.valoresCampos();
        String[] valoresCoordenador = Arrays.copyOf(valoresUsuario, valoresUsuario.length + 1);
        valoresCoordenador[valoresCoordenador.length -1] = String.valueOf(cndb);
        return valoresCoordenador;
    }

    @Override
    public void preencherCampos(String[] valores){
        super.preencherCampos(valores);
        this.cndb = Integer.parseInt(valores[valores.length - 1]);
    }

    @Override
    public String textoLista() {
        return super.textoLista() + getCndb();
    }
}
