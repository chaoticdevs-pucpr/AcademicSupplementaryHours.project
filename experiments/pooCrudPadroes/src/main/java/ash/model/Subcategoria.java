package ash.model;

import java.io.Serializable;

public class Subcategoria implements CadastroItem, Serializable {

    private int id;
    private String categoria = "";
    private String nome = "";
    private String maxHoras = "";

    public Subcategoria() {
    }

    @Override
    public int getId() {
        return id;
    }

    @Override
    public void setId(int id) {
        this.id = id;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getMaxHoras() {
        return maxHoras;
    }

    public void setMaxHoras(String maxHoras) {
        this.maxHoras = maxHoras;
    }

    @Override
    public String[] nomeCampos() {
        return new String[]{"Categoria", "Nome", "Maximo de horas"};
    }

    @Override
    public String[] valoresCampos() {
        return new String[]{
                categoria != null ? categoria : "",
                nome != null ? nome : "",
                maxHoras != null ? maxHoras : ""
        };
    }

    @Override
    public void preencherCampos(String[] valores) {
        this.categoria = valores[0];
        this.nome = valores[1];
        this.maxHoras = valores[2];
    }

    @Override
    public String textoLista() {
        return id + " - " + categoria + " - " + nome + " - " + maxHoras + "h";
    }
}