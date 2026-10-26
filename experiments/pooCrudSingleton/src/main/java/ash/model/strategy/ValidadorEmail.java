package ash.model.strategy;

public class ValidadorEmail implements ValidadorCampoStrategy {
    @Override
    public void validar(String nomeCampo, String valor) throws Exception {
        String regexEmail = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$";
        if (!valor.matches(regexEmail)) {
            throw new Exception("O formato do e-mail é inválido. Verifique se contém '@' e o domínio.");
        }
    }
}
