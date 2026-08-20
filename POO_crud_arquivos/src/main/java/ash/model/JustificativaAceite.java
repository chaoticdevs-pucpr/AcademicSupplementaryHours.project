package ash.model;

import java.io.Serializable;

public class JustificativaAceite implements CadastroItem, Serializable {

    private int id;
    // Inicializando com vazio para não quebrar a tela do JavaFX com null
    private String idSolicitacao = "";
    private String parecer = "";
    private String horasAprovadas = "";
    private String status = "";

    public JustificativaAceite() {}

    @Override
    public int getId() {
        return id;
    }

    @Override
    public void setId(int id) {
        this.id = id;
    }

    public String getIdSolicitacao() {
        return idSolicitacao;
    }

    public void setIdSolicitacao(String idSolicitacao) {
        this.idSolicitacao = idSolicitacao;
    }

    public String getParecer() {
        return parecer;
    }

    public void setParecer(String parecer) {
        this.parecer = parecer;
    }

    public String getHorasAprovadas() {
        return horasAprovadas;
    }

    public void setHorasAprovadas(String horasAprovadas) {
        this.horasAprovadas = horasAprovadas;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    @Override
    public String[] nomeCampos() {
        return new String[]{"Solicitacao", "Parecer", "Horas Aprovadas", "Status"};
    }

    @Override
    public String[] valoresCampos() {
        return new String[]{
                idSolicitacao != null ? idSolicitacao : "",
                parecer != null ? parecer : "",
                horasAprovadas != null ? horasAprovadas : "",
                status != null ? status : ""
        };
    }

    @Override
    public void preencherCampos(String[] valores) {
        this.idSolicitacao = valores[0];
        this.parecer = valores[1];
        this.horasAprovadas = valores[2];
        this.status = valores[3];
    }

    @Override
    public String textoLista() {
        return id + " - Solicitacao: " + idSolicitacao + " (" + status + ")";
    }
}