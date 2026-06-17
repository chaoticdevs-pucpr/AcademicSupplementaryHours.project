package ash.model;

import java.io.Serializable;

public class Evento implements CadastroItem, Serializable {
    private int id;
    private String nome;
    private String data;
    private String descricao;
    private String tipo;

    public Evento() {
    }

    public String getNome() {
        return nome;
    }
     public void setNome(String nome) {
        this.nome = nome;
    }
    public String getData() {
        return data;
    }
    public void setData(String data) {
        this.data = data;
    }
    @Override
    public int getId() {
        return 0;
    }
    @Override
    public void setId(int id) {
    this.id = id;}
    public String getDescricao() {
        return descricao;
    }
    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }
    public String getTipo() {
        return tipo;
    }
    public void setTipo(String tipo) {
        this.tipo = tipo;
    }



    @Override
    public String textoLista() {
        return nome + " - " + data + " - " + descricao + " - " + tipo;
    }

    @Override
    public void preencherCampos(String[] valores) {
        nome = valores[0];
        data = valores[1];
        descricao = valores[2];
        tipo = valores[3];
    }

    @Override
    public String[] valoresCampos() {
        return new String[]{nome,data,descricao,tipo};
    }



    @Override
    public String[] nomeCampos() {
        return new String[]{"Nome","Data","Descrição","Tipo"};
    }


}
