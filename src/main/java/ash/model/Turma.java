package ash.model;
// Daniel passou por aqui

public class Turma implements CadastroItem {
    private int id;
    private String nome;
    private String curso;
    private String periodo;

    public Turma() {}

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getCurso() {
        return curso;
    }

    public void setCurso(String curso) {
        this.curso = curso;
    }

    public String getPeriodo() {
        return periodo;
    }

    public void setPeriodo(String periodo) {
        this.periodo = periodo;
    }

    @Override
    public String[] nomeCampos() {
        return new String[]{"Nome", "Curso", "Periodo"};
    }

    @Override
    public String[] valoresCampos() {
        return new String[]{nome, curso, periodo};
    }

    @Override
    public void preencherCampos(String[] valores) {
        nome = valores[0];
        curso = valores[1];
        periodo = valores[2];
    }

    @Override
    public String textoLista() {
        return id + " - " + nome + " - " + curso + " - " + periodo;
    }
}