const XLSX = require('xlsx')

function jsonToExcel(jsonData, fileName) {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(jsonData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Planilha1');
    XLSX.writeFile(workbook, fileName);
}

module.exports ={
    jsonToExcel
}