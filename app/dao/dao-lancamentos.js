import {Storage, SqlStorage} from "ionic-angular";

export class DAOLancamentos {
    constructor() {
        let storage = new Storage(SqlStorage);

        // storage.query("DROP TABLE lancamentos");
        storage
            .query(`
            CREATE TABLE IF NOT EXISTS lancamentos  (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            descricao TEXT, 
            valor REAL, 
            data INTEGER, 
            conta_id INTEGER, 
            entradaSaida TEXT, 
            pago INTEGER
            )`)
            .then(data=> {
                    console.log('Tabela lançamento criada', data);
                },
                error=> {
                    console.log("ERRO:", error);

                });
    }

    list(dataInicio, dataFim, cb) {
        let storage = new Storage(SqlStorage);
        storage
            .query(`
            SELECT *,lancamentos.id as id, lancamentos.descricao as descricao,  contas.descricao as conta_name FROM lancamentos 
            INNER JOIN contas ON contas.id = lancamentos.conta_id 
            WHERE data >= ? AND data <= ?
            `, [dataInicio.getTime(), dataFim.getTime()])
            .then(data=> {
                    let lista = [];
                    for (let i = 0; i < data.res.rows.length; i++) {
                        let row = data.res.rows.item(i);
                        console.info(row);
                        lista.push(row);
                    }
                    cb(lista);
                },
                error=> {
                    console.log("ERROR:", JSON.stringify(error.err));
                })
    }

    insert(lancamento, cb) {
        let storage = new Storage(SqlStorage);
        storage
            .query(`
            INSERT INTO lancamentos 
            (descricao, valor, data, conta_id, entradaSaida,pago) 
            VALUES (?,?,?,?,?,?)
            `, [lancamento.descricao, lancamento.valor, lancamento.data, lancamento.conta_id, lancamento.entradaSaida, lancamento.pago])
            .then(data=> {
                    cb(lancamento);
                },
                error=> {
                    console.log("ERROR:", JSON.stringify(error.err));
                });
    }

    update(lancamento, cb) {
        let storage = new Storage(SqlStorage);
        storage
            .query(`
            UPDATE lancamentos 
            SET descricao = ?, 
            valor = ?, 
            data = ?, 
            conta_id = ?, 
            entradaSaida = ? , 
            pago = ? WHERE id = ?`
                , [lancamento.descricao, lancamento.valor, lancamento.data, lancamento.conta_id, lancamento.entradaSaida, lancamento.pago, lancamento.id])
            .then(data=> {
                cb(lancamento);
            }, error=> {
                console.log('Erro de adicionar a conta', JSON.stringify(error.err));
            });
    }

    delete(conta, cb) {
        let storage = new Storage(SqlStorage);
        storage
            .query(`
            DELETE FROM lancamentos WHERE id= ?
            `, [conta.id])
            .then(data=> {
                cb(conta);
            }, error=> {
                console.log('Erro de adicionar a conta', JSON.stringify(error.err));
            });
    }

    getSaldo(cb) {
        let storage = new Storage(SqlStorage);
        storage
            .query(`
            SELECT conta_id, entradaSaida, TOTAL(valor) as saldo from lancamentos
            WHERE pago=1 AND entradaSaida = 'entrada'
            UNION
            SELECT conta_id, entradaSaida,TOTAL(valor) as saldo from lancamentos
            WHERE pago=1 AND entradaSaida = 'saida'
            `, [])
            .then(data=> {
                let saldo = 0;
                let rows  = data.res.rows;
                for (let i = 0; i < rows.length; i++) {
                    let item = rows.item(i);
                    console.log(item);
                    if (item.entradaSaida == 'entrada')
                        saldo += item.saldo
                    else
                        saldo -= item.saldo
                }

                cb(saldo);
            }, error=> {
                console.log('Erro de adicionar a conta', JSON.stringify(error.err));
            });
    }

    getListGroupByConta(dataInicio, dataFim, entradaSaida, cb) {
        let storage = new Storage(SqlStorage);
        storage
            .query(`
            SELECT contas.descricao as conta, TOTAL(valor) as saldo FROM lancamentos
            INNER JOIN contas ON contas.id = lancamentos.conta_id
            WHERE data >= ? AND data <= ? AND
            entradaSaida = ? AND
            pago = 1
            GROUP BY conta
            `, [dataInicio.getTime(), dataFim.getTime(), entradaSaida])
            .then(data=> {
                let result = [];
                let rows   = data.res.rows;
                for (let i = 0; i < rows.length; i++) {
                    let row = rows.item(i);
                    result.push(row);
                }
                cb(result);
            }, error=> {
                console.log('Erro de adicionar a conta', error);
            });
    }

}