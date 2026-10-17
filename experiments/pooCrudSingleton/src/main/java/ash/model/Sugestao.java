package ash.model;

import java.io.Serializable;

public class Sugestao implements CadastroItem, Serializable {
    private int id;
    private String matriculaEstudante; // Para saber quem enviou
    private String titulo;
    private String descricao;

    public Sugestao() {}

    // Getters e Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public String getMatriculaEstudante() { return matriculaEstudante; }
    public void setMatriculaEstudante(String matriculaEstudante) { this.matriculaEstudante = matriculaEstudante; }
    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    @Override
    public String[] nomeCampos() {
        return new String[]{"Matrícula do Estudante", "Título da Sugestão", "Descrição"};
    }

    @Override
    public String[] valoresCampos() {
        return new String[]{matriculaEstudante, titulo, descricao};
    }

    @Override
    public void preencherCampos(String[] valores) {
        this.matriculaEstudante = valores[0];
        this.titulo = valores[1];
        this.descricao = valores[2];
    }

    @Override
    public String textoLista() {
        return getId() + " - " + getMatriculaEstudante() + " - " + getTitulo();
    }
}