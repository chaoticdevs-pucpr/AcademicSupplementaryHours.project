package ash.model;

public class Categorias implements CadastroItem{

    private int id;
    private String manual;
    private String nome;
    private String maxHoras;

    @Override
    public int getId() {
        return id;
    }

    @Override
    public void setId(int id) {
        this.id = id;
    }

    public String getManual() {
        return manual;
    }

    public void setManual(String manual) {
        this.manual = manual;
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
        return new String[]{"Manual", "Nome", "Maximo de horas"};
    }

    @Override
    public String[] valoresCampos() {
        return new String[]{manual, nome, maxHoras};
    }

    @Override
    public void preencherCampos(String[] valores) {
        manual = valores[0];
        nome = valores[1];
        maxHoras = valores[2];
    }

    @Override
    public String textoLista() {
        return id + "-" + manual + "-" + nome + "-" + maxHoras;
    }
}
