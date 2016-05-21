import {Storage, SqlStorage} from "ionic-angular";

export class DAOContas {
    constructor() {
        let storage = new Storage(SqlStorage);

        // create table if not exists
        storage
            .query("CREATE TABLE IF NOT EXISTS contas (id INTEGER PRIMARY KEY AUTOINCREMENT, descricao TEXT)")
            .then(data=> {
                console.log('Tabela criada', data);
            }, error=> {
                console.log('Erro na criação da tabela', JSON.stringify(error.err));
            });
    }

    getList(cb) {
        let storage = new Storage(SqlStorage);
        storage
            .query("SELECT * FROM contas")
            .then(data=> {
                let lista = [];

                for (let i = 0; i < data.res.rows.length; i++) {
                    let row  = data.res.rows.item(i);
                    let item = {
                        id: row.id,
                        descricao: row.descricao
                    };
                    lista.push(item);
                }
                
                cb(lista);
            }, error=> {
                console.log('Erro no select', JSON.stringify(error.err));
            });
    }

    insert(conta, cb) {
        let storage = new Storage(SqlStorage);
        storage
            .query("INSERT INTO contas(descricao) VALUES(?)", [conta.descricao])
            .then(data=> {
                conta.id = data.res.insertId;
                console.log('insert', conta);
                cb(conta);
            }, error=> {
                console.log('Erro de adicionar a conta', JSON.stringify(error.err));
            });
    }

    edit(conta, cb) {
        let storage = new Storage(SqlStorage);
        storage
            .query("UPDATE contas SET descricao = ? WHERE id = ?", [conta.descricao, conta.id])
            .then(data=> {
                cb(conta);
            }, error=> {
                console.log('Erro de adicionar a conta', JSON.stringify(error.err));
            });
    }

    delete(conta, cb) {
        let storage = new Storage(SqlStorage);
        storage
            .query("DELETE FROM contas WHERE id= ?", [conta.id])
            .then(data=> {
                cb(conta);
            }, error=> {
                console.log('Erro de adicionar a conta', JSON.stringify(error.err));
            });
    }
}