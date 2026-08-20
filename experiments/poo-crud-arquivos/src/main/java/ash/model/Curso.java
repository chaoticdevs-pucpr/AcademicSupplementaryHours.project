package ash.model;
// Daniel passou por aqui

public class Curso implements CadastroItem {
    private int id;
    private String nome;
    private String turno;
    private String status;

    public Curso() {
    }

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

    public String getTurno() {
        return turno;
    }

    public void setTurno(String turno) {
        this.turno = turno;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    @Override
    public String[] nomeCampos() {
        return new String[]{"Nome", "Turno", "Status"};
    }

    @Override
    public String[] valoresCampos() {
        return new String[]{nome, turno, status};
    }

    @Override
    public void preencherCampos(String[] valores) {
        nome = valores[0];
        turno = valores[1];
        status = valores[2];
    }

    @Override
    public String textoLista() {
        return id + " - " + nome + " - " + turno + " - " + status;
    }
}