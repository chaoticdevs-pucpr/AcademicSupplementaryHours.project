package ash.model;

import java.io.Serializable;

public class Solicitacao implements CadastroItem, Serializable {
    private int id;
    private String matriculaEstudante = "";
    private String atividade = "";
    private String categoria = "";
    private String subcategoria = "";
    private String horasSolicitadas = "";

    private String status = "Pendente";

    public Solicitacao() {}

    // --- Getters e Setters ---

    @Override
    public int getId() { return id; }

    @Override
    public void setId(int id) { this.id = id; }

    public String getMatriculaEstudante() { return matriculaEstudante; }
    public void setMatriculaEstudante(String matriculaEstudante) { this.matriculaEstudante = matriculaEstudante; }

    public String getAtividade() { return atividade; }
    public void setAtividade(String atividade) { this.atividade = atividade; }

    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }

    public String getSubcategoria() { return subcategoria; }
    public void setSubcategoria(String subcategoria) { this.subcategoria = subcategoria; }

    public String getHorasSolicitadas() { return horasSolicitadas; }
    public void setHorasSolicitadas(String horasSolicitadas) { this.horasSolicitadas = horasSolicitadas; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }


    @Override
    public String[] nomeCampos() {
        return new String[]{"Matrícula", "Atividade/Curso", "Categoria", "Subcategoria", "Horas Solicitadas"};
    }

    @Override
    public String[] valoresCampos() {
        return new String[]{
                matriculaEstudante != null ? matriculaEstudante : "",
                atividade != null ? atividade : "",
                categoria != null ? categoria : "",
                subcategoria != null ? subcategoria : "",
                horasSolicitadas != null ? horasSolicitadas : ""
        };
    }

    @Override
    public void preencherCampos(String[] valores) {
        this.matriculaEstudante = valores[0];
        this.atividade = valores[1];
        this.categoria = valores[2];
        this.subcategoria = valores[3];
        this.horasSolicitadas = valores[4];
    }

    @Override
    public String textoLista() {
        return getId() + " - " + getAtividade() + " (" + getHorasSolicitadas() + "h) - " + getStatus();
    }
}