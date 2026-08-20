package ash.model;

import java.io.Serializable;

public interface CadastroItem extends Serializable {
    int getId();
    void setId(int id);
    String[] nomeCampos();
    String[] valoresCampos();
    void preencherCampos(String[] valores);
    String textoLista();

}
