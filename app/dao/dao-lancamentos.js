import {Storage, SqlStorage} from "ionic-angular";

export class DAOLancamentos {
    constructor() {
        let storage = new Storage(SqlStorage);

        storage
            .query("CREATE TABLE IF NOT EXISTS lancamentos (id INTEGER PRIMARY KEY AUTOINCREMENT, descricao TEXT, valor REAL, data INTEGER, conta INTEGER, entradaSaida TEXT, pago INTEGER)")
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
            .query("SELECT * FROM lancamentos WHERE data >= ? AND data <= ?", [dataInicio.getTime(), dataFim.getTime()])
            .then(data=> {
                    let lista = [];
                    for (let i = 0; i < data.res.rows.length; i++) {
                        let row  = data.res.rows.item(i);
                        let item = {
                            id: row.id,
                            data: row.data,
                            pago: row.pago,
                            valor: row.valor,
                            conta: row.conta,
                            entradaSaida: row.entradaSaida,
                            pago: row.pago,
                            descricao: row.descricao
                        };
                        console.log(item);
                        lista.push(item);
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
            .query("INSERT INTO lancamentos (descricao, valor, data, conta, entradaSaida,pago) VALUES (?,?,?,?,?,?)", [lancamento.descricao, lancamento.valor, lancamento.data, lancamento.conta, lancamento.entradaSaida, lancamento.pago])
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
            .query("UPDATE lancamentos SET descricao = ?, valor = ?, data = ?, conta = ?, entradaSaida = ? , pago = ? WHERE id = ?", [lancamento.descricao, lancamento.valor, lancamento.data, lancamento.conta, lancamento.entradaSaida, lancamento.pago, lancamento.id])
            .then(data=> {
                cb(lancamento);
            }, error=> {
                console.log('Erro de adicionar a conta', JSON.stringify(error.err));
            });
    }

    delete(conta, cb) {
        let storage = new Storage(SqlStorage);
        storage
            .query("DELETE FROM lancamentos WHERE id= ?", [conta.id])
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
            SELECT conta, entradaSaida, TOTAL(valor) as saldo from lancamentos
            WHERE pago=1 AND entradaSaida = 'entrada'
            UNION
            SELECT conta, entradaSaida,TOTAL(valor) as saldo from lancamentos
            WHERE pago=1 AND entradaSaida = 'saidas'
            `, [])
            .then(data=> {
                let saldo = 0;
                let rows = data.res.rows;
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
}