package ash.model.strategy;

public interface ValidadorCampoStrategy {
    void validar(String nomeCampo, String valor) throws Exception;
}
