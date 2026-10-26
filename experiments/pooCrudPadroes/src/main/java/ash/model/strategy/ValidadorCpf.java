package ash.model.strategy;

public class ValidadorCpf implements ValidadorCampoStrategy {
    @Override
    public void validar(String nomeCampo, String valor) throws Exception {
        String cpfLimpo = valor.replaceAll("[^0-9]", "");
        if (cpfLimpo.length() != 11) {
            throw new Exception("O CPF digitado é inválido. Ele deve conter exatamente 11 dígitos.");
        }
    }
}
