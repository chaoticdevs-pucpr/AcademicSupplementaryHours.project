package ash.model;

public class Manual implements CadastroItem{

    private int id;
    private String versao;
    private String curso;
    private String horasObjetivo;

    @Override
    public int getId() {
        return id;
    }

    @Override
    public void setId(int id) {
        this.id = id;
    }

    public String getVersao() {
        return versao;
    }

    public void setVersao(String versao) {
        this.versao = versao;
    }

    public String getCurso() {
        return curso;
    }

    public void setCurso(String curso) {
        this.curso = curso;
    }

    public String getHorasObjetivo() {
        return horasObjetivo;
    }

    public void setHorasObjetivo(String horasObjetivo) {
        this.horasObjetivo = horasObjetivo;
    }

    @Override
    public String[] nomeCampos() {
        return new String[]{"Versão", "Curso", "Horas objetivo"};
    }

    @Override
    public String[] valoresCampos() {
        return new String[]{versao, curso, horasObjetivo};
    }

    @Override
    public void preencherCampos(String[] valores) {
        versao = valores[0];
        curso = valores[1];
        horasObjetivo = valores[2];
    }

    @Override
    public String textoLista() {
        return id + "-" + versao + "-" + curso + "-" + horasObjetivo;
    }
}
