package ash.model.strategy;

public class ValidadorStatusJustificativa implements ValidadorCampoStrategy {
    @Override
    public void validar(String nomeCampo, String valor) throws Exception {
        if (!valor.equalsIgnoreCase("Aceito") && !valor.equalsIgnoreCase("Rejeitado")) {
            throw new Exception("Status deve ser 'Aceito' ou 'Rejeitado'.");
        }
    }
}
