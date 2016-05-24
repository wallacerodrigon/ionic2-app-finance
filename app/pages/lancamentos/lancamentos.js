import {Page, Alert, NavController, Modal} from "ionic-angular";
import {Toast} from "ionic-native";
import {ModalLancamentoPage} from "../modal-lancamento/modal-lancamento";
import {DAOContas} from "../../dao/dao-contas";
import {DAOLancamentos} from "../../dao/dao-lancamentos";
import {DataUtil} from "../../util/data.util";
import {DataFilter} from "../../components/data-filter/data-filter";

@Page({
    templateUrl: 'build/pages/lancamentos/lancamentos.html',
    directives: [DataFilter]
})
export class LancamentosPage {
    static get parameters() {
        return [[NavController]];
    }

    constructor(nav) {
        this.nav       = nav;

        // Lançamentos
        this.dao       = new DAOLancamentos();

        // Contas
        this.daoContas = new DAOContas();
        this.contas     = [];
        this.daoContas.list(contas=> {
            this.contas = contas;
        });
        this.dataFiltro = new Date();
        this._getList();
    }

    _getList() {

        let dataUtil    = new DataUtil();
        let startDate   = dataUtil.getFirstDay(this.dataFiltro);
        let endDate     = dataUtil.getLastDay(this.dataFiltro);
        // Lançamentos
        this.lancamentos = [];
        this.dao.list(startDate, endDate, lancamentos=> {
            this.lancamentos = lancamentos;
        })
    }

    insert() {
        let modal = Modal.create(ModalLancamentoPage);
        modal.onDismiss(lancamento=> {
            this.dao.insert(lancamento, newLancamento=> {
                this._getList();
                Toast.showShortBottom('Lançamento adicinado').subscribe(text=>console.log(text));
            })
        });
        this.nav.present(modal);
    }

    edit(lancamento) {
        let modal = Modal.create(ModalLancamentoPage, {parametro: lancamento});
        modal.onDismiss(lancamento=> {
            this.dao.update(lancamento, data=> {
                this._getList();
                Toast.showShortBottom('Lançamento editado').subscribe(text=>console.log(text));
            })
        });
        this.nav.present(modal);
    }

    delete(lancamento) {
        let confirm = Alert.create({
            title: 'Excluir',
            body: 'Gostaria de realmente excluir esse lançamento ' + lancamento.descricao + "?",
            buttons: [
                {
                    text: 'Sim',
                    handler: ()=> {
                        this.dao.delete(lancamento, data=> {
                            this._getList();
                            Toast.showShortBottom('Conta deletada').subscribe(text=>console.log(text));
                        });
                    }
                },
                {
                    text: 'Não'
                },
            ]
        });
        this.nav.present(confirm);
    }

    updateMonth(mes) {
        console.log('Mes alterado', mes.getMonth());
        this._getList();
    }

    getDate(lancamento) {
        let dataUtil = new DataUtil();
        return dataUtil.parseString(lancamento.data);
    }

    getConta(lancamento) {
        return this.contas.filter(conta=> {
            return parseInt(conta.id) == parseInt(lancamento.conta);
        })[0];
    }

    situacaoLancamento(lancamento) {
        return lancamento.pago ? 'Pago' : 'Não Pago';
    }

    lancamentoEntrada(lancamento) {
        return lancamento.entradaSaida == 'entrada';
    }


}
