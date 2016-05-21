export class DAOContas {
    constructor() {
        this.list = [];
    }

    getList() {
        this.list = [
            {descricao: 'Alimentação'},
            {descricao: 'Lazer'},
            {descricao: 'Transporte'}
        ];

        return this.list;
    }

    insert(conta) {
        this.list.push(conta);
    }

    edit(conta) {
        console.log('edit', conta);
        let pos        = this.list.indexOf(conta);
        this.list[pos] = conta;
    }

    delete(conta) {
        let pos = this.list.indexOf(conta);
        this.list.splice(pos, 1);
    }
}