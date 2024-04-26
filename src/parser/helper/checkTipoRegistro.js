function checkTipoRegistro(linha) {
    const tipo = linha && linha[7]
    switch (+tipo) {
        case 0:
            return 'ArquivoHeader'
            break;
        case 1:
            return 'LoteHeader'
            break;
        case 3:
            return 'Pagamento'
            break;
        case 5:
            return 'LoteTrailing'
            break;
        case 9:
            return 'ArquivoTrailing'
            break;

        default:
            return null
            break;
    }
}
module.exports = {
    checkTipoRegistro
}