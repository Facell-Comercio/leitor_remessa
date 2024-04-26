const rules = require("../layout/rules");

function parseArquivoPagamento(banco, string) {
    const segmento = string?.substring(13,14) || 0;
    const layout = rules[banco].Pagamento.Detail[segmento];
    
    const object = {};
    layout.filter(i=>i.field !== 'brancos').forEach(field => {
        const { field: fieldName, startPos, endPos } = field;
        const value = string.substring(startPos - 1, endPos).trim();
        
        object[fieldName] = field.format === 'float' && value ? parseFloat(value) / 100 * (object.movimento === '2' ? -1: 1) : value;
    });
    
    return object;
}

module.exports = {
    parseArquivoPagamento
}