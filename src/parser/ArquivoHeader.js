const rules = require("../layout/rules");

function parseArquivoHeader(banco, string) {
    const layout = rules[banco].ArquivoHeader;

    const object = {};
    layout.forEach(field => {
        const { field: fieldName, startPos, endPos } = field;
        const value = string.substring(startPos - 1, endPos).trim();
        object[fieldName] = value;
    });
    
    return object;
}

module.exports = {
    parseArquivoHeader
}