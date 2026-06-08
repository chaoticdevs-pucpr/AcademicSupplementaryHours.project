package ash.model;

import java.io.Serializable;

public class Solicitacao implements CadastroItem, Serializable {
    private int id;
    private String matriculaEstudante;
    private String atividade;
    private String horasSolicitadas;
    private String status; // "Pendente", "Aprovado", "Rejeitado"

    public Solicitacao() {
        this.status = "Pendente"; // Status padrão ao criar
    }

    // Getters e Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public String getMatriculaEstudante() { return matriculaEstudante; }
    public void setMatriculaEstudante(String matriculaEstudante) { this.matriculaEstudante = matriculaEstudante; }
    public String getAtividade() { return atividade; }
    public void setAtividade(String atividade) { this.atividade = atividade; }
    public String getHorasSolicitadas() { return horasSolicitadas; }
    public void setHorasSolicitadas(String horasSolicitadas) { this.horasSolicitadas = horasSolicitadas; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    @Override
    public String[] nomeCampos() {
        return new String[]{"Matrícula", "Atividade/Curso", "Horas Solicitadas", "Status"};
    }

    @Override
    public String[] valoresCampos() {
        return new String[]{matriculaEstudante, atividade, horasSolicitadas, status};
    }

    @Override
    public void preencherCampos(String[] valores) {
        this.matriculaEstudante = valores[0];
        this.atividade = valores[1];
        this.horasSolicitadas = valores[2];
        this.status = valores[3];
    }

    @Override
    public String textoLista() {
        return getId() + " - " + getAtividade() + " (" + getHorasSolicitadas() + "h) - " + getStatus();
    }
}