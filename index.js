const fs = require('fs')
const path = require('path');
const { parseArquivoHeader } = require('./src/parser/ArquivoHeader');
const { parseArquivoTrailing } = require('./src/parser/ArquivoTailing');
const { parseArquivoPagamento } = require('./src/parser/Pagamento');
const { checkTipoRegistro } = require('./src/parser/helper/checkTipoRegistro');
const { jsonToExcel } = require('./src/helper/jsonToExcel')

async function leituraCNAB240() {
    try {

        const files = await fs.readdirSync(path.join(__dirname, 'public'))

        const registrosA = []
        const registrosD = []
        const registrosE = []

        for (const file of files) {
            // Caminho para o arquivo que você deseja ler
            const fileContent = fs.readFileSync(path.join('public', file), 'utf-8');
            // Dividindo o conteúdo do arquivo em linhas
            const linhas = fileContent.split('\n');
            // Iterando sobre as linhas
            const arquivo = {
                arquivoHeader: {},
                lotes: [],
                pagamentos: [],
                arquivoTrailing: {}
            }

            for (const linha of linhas) {
                if (!linha) {
                    continue;
                }
                const tipo = checkTipoRegistro(linha)
                // console.log(tipo)
                if (tipo === 'ArquivoHeader') {
                    arquivo.arquivoHeader = parseArquivoHeader('ITAU', linha)
                }
                if (tipo === 'Pagamento') {
                    const pagamento = parseArquivoPagamento('ITAU', linha)
                    if (pagamento.cod_seg_registro_lote === 'A') {
                        registrosA.push(pagamento)
                    }
                    if (pagamento.cod_seg_registro_lote === 'D') {
                        registrosD.push(pagamento)

                    }
                    if (pagamento.cod_seg_registro_lote === 'E') {
                        registrosE.push(pagamento)

                    }
                    arquivo.pagamentos.push(pagamento)
                }
                if (tipo === 'ArquivoTrailing') {
                    arquivo.arquivoTrailing = parseArquivoTrailing('ITAU', linha)
                }

            };
        }

        jsonToExcel(registrosA, 'SegmentoA.xlsx')
        jsonToExcel(registrosD, 'SegmentoD.xlsx')
        jsonToExcel(registrosE, 'SegmentoE.xlsx')

    } catch (error) {
        console.error('Erro ao ler o arquivo:', error);
    }
}


async function leituraCNAB240_DRE() {
    try {

        const files = await fs.readdirSync(path.join(__dirname, 'public'))

        const arquivos = []

        for (const file of files) {
            // Caminho para o arquivo que você deseja ler
            const fileContent = fs.readFileSync(path.join('public', file), 'utf-8');
            // Dividindo o conteúdo do arquivo em linhas
            const linhas = fileContent.split('\n');
            // Iterando sobre as linhas
            const arquivo = {
                arquivoHeader: {},
                lotes: [],
                pagamentos: [],
                arquivoTrailing: {}
            }

            for (const linha of linhas) {
                if (!linha) {
                    continue;
                }
                const tipo = checkTipoRegistro(linha)
                // console.log(tipo)
                if (tipo === 'ArquivoHeader') {
                    arquivo.arquivoHeader = parseArquivoHeader('ITAU', linha)
                }
                if (tipo === 'Pagamento') {
                    const pagamento = parseArquivoPagamento('ITAU', linha)
                    if (pagamento.cod_seg_registro_lote === 'A') {
                        arquivo.pagamentos.push(pagamento)
                    }
                    if (pagamento.cod_seg_registro_lote === 'D') {
                        arquivo.pagamentos.push(pagamento)

                    }
                    if (pagamento.cod_seg_registro_lote === 'E') {
                        arquivo.pagamentos.push(pagamento)

                    }
                    // arquivo.pagamentos.push(pagamento)
                }
                if (tipo === 'ArquivoTrailing') {
                    arquivo.arquivoTrailing = parseArquivoTrailing('ITAU', linha)
                }

            };
            arquivos.push(arquivo)
        }

        const rows = []
        for (const arquivo of arquivos) {
            // Loop infinito passando pela
            for (let index = 1; index < arquivo.pagamentos.length; index++) {
                const linhas_colaborador = arquivo.pagamentos.filter(pgto => pgto.num_seq_registro_lote == index)
                if (linhas_colaborador.length <= 0) {
                    break
                }
                // Dados do colaborador:
                for (const colab of linhas_colaborador) {
                    const row = {}
                    row.segmento = ''
                    // Dados do header
                    row.banco = arquivo.arquivoHeader.banco
                    row.lote = arquivo.arquivoHeader.lote
                    row.conta_agencia = arquivo.arquivoHeader.conta_agencia
                    row.agencia_dig_verificador = arquivo.arquivoHeader.agencia_dig_verificador
                    row.conta_num = arquivo.arquivoHeader.conta_num
                    row.conta_dig_verificador = arquivo.arquivoHeader.conta_dig_verificador
                    row.empresa_nome = arquivo.arquivoHeader.empresa_nome
                    row.empresa_inscricao_num = arquivo.arquivoHeader.empresa_inscricao_num
                    
                    // Comum a todas as linhas:
                    row.data_pagamento =''

                    // Percorrer para obter esses dados para todas as linhas:
                    for (const colab2 of linhas_colaborador) {
                        if(colab2.data_pagamento){
                            row.data_pagamento = colab2.data_pagamento
                        }
                        if(colab2.mes_ano_pagamento){
                            row.mes_ano_pagamento = colab2.mes_ano_pagamento
                        }
                        if(colab2.mes_ano_pagamento){
                            row.mes_ano_pagamento = colab2.mes_ano_pagamento
                        }
                        if(colab2.cargo){
                            row.cargo = colab2.cargo
                        }
                        if(colab2.cod_funcionario){
                            row.cod_funcionario = colab2.cod_funcionario
                        }
                        if(colab2.favorecido_nome){
                            row.favorecido_nome = colab2.favorecido_nome
                        }
                        if(colab2.doc_empresa){
                            row.doc_empresa = colab2.doc_empresa
                        }
                        if(colab2.doc_empresa){
                            row.doc_empresa = colab2.doc_empresa
                        }

                    }

                    if (colab.cod_seg_registro_lote === 'A') {
                        row.segmento = 'A'
                        row.favorecido_cod_banco = colab.favorecido_cod_banco
                        row.favorecido_agencia = colab.favorecido_agencia
                        row.favorecido_dig_agencia = colab.favorecido_dig_agencia
                        row.favorecido_num_conta = colab.favorecido_num_conta
                        row.favorecido_dig_verificador = colab.favorecido_dig_verificador
                        row.ag_conta_digito_verificador = colab.ag_conta_digito_verificador
                        row.favorecido_nome = colab.favorecido_nome
                        row.doc_empresa = colab.doc_empresa
                        row.valor_pagamento = colab.valor_pagamento
                        rows.push(row)

                    }
                    if (colab.cod_seg_registro_lote === 'D') {
                        row.segmento = 'D'
                        row.centro_custo = colab.centro_custo
                        
                        row.ferias_de = colab.ferias_de
                        row.ferias_ate = colab.ferias_ate
                        row.qtde_dep_imp_renda = colab.qtde_dep_imp_renda
                        row.qtde_dep_salario_fam = colab.qtde_dep_salario_fam
                        row.horas_semanais = colab.horas_semanais
                        row.valor_salario_contrib = colab.valor_salario_contrib
                        row.valor_fgts = colab.valor_fgts
                        row.valor_credito = colab.valor_credito
                        row.valor_debito = colab.valor_debito
                        row.valor_liquido = colab.valor_liquido
                        row.valor_base = colab.valor_base
                        row.valor_base_irrf = colab.valor_base_irrf
                        row.valor_base_fgts = colab.valor_base_fgts
                        rows.push(row)
                    }
                    if (colab.cod_seg_registro_lote === 'E') {
                        row.segmento = 'E'
                        for (let i = 1; i < 5; i++) {
                            let descricao = colab[`descricao${i}`]
                            if(!descricao) break;
                            const novaRow = {
                                ...row, 
                                descricao: descricao,
                                valor: colab[`valor${i}`]
                            }
                            rows.push(novaRow)
                        }
                    }
                }

            }
        }
        jsonToExcel(rows, 'Arquivos.xlsx')

    } catch (error) {
        console.error('Erro ao ler o arquivo:', error);
    }
}


leituraCNAB240_DRE()