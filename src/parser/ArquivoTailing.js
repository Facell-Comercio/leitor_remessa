const rules = require("../layout/rules");

function parseArquivoTrailing(banco, string) {
    const layout = rules[banco].ArquivoTrailing;

    const object = {};
    layout.forEach(field => {
        const { field: fieldName, startPos, endPos } = field;
        const value = string.substring(startPos - 1, endPos).trim();
        object[fieldName] = value;
    });
    
    return object;
}

module.exports = {
    parseArquivoTrailing
}