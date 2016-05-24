import {Page, Alert, NavController, Modal} from "ionic-angular";
import {Toast} from "ionic-native";
import {ModalLancamentoPage} from "../modal-lancamento/modal-lancamento";
import {DAOContas} from "../../dao/dao-contas";
import {DAOLancamentos} from "../../dao/dao-lancamentos";
import {DataUtil} from "../../util/data.util";

@Page({
    templateUrl: 'build/pages/lancamentos/lancamentos.html',
})
export class LancamentosPage {
    static get parameters() {
        return [[NavController]];
    }

    constructor(nav) {
        this.nav         = nav;
        // Contas
        this.dao         = new DAOLancamentos();
        this.daoContas = new DAOContas();
        this.contas =[];
        this.daoContas.list(contas=>{
            this.contas = contas;
        })
        // Lançamentos
        this.lancamentos = [];
        this.dao.list(lancamentos=> {
            this.lancamentos = lancamentos;
        })
    }

    insert() {
        let modal = Modal.create(ModalLancamentoPage);
        modal.onDismiss(lancamento=> {
            this.dao.insert(lancamento, newLancamento=> {
                this.lancamentos.push(newLancamento);
                Toast.showShortBottom('Lançamento adicinado').subscribe(text=>console.log(text));
            })
        });
        this.nav.present(modal);
    }

    edit(lancamento) {
        let modal = Modal.create(ModalLancamentoPage, {parametro: lancamento});
        modal.onDismiss(lancamento=> {
            this.dao.update(lancamento, data=> {
                console.log('Data', data);
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
                            let pos = this.lancamentos.indexOf(lancamento);
                            this.lancamentos.splice(pos, 1);
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

    getDate(lancamento) {
        let dataUtil = new DataUtil();
        return dataUtil.parseString(lancamento.data);
    }

    getConta(lancamento) {
        return this.contas.filter(conta=>{
            return parseInt(conta.id) == parseInt(lancamento.conta);
        })[0];
    }
    
    situacaoLancamento (lancamento) {
        return lancamento.pago ? 'Pago' : 'Não Pago';
    }

    lancamentoEntrada(lancamento) {
        return lancamento.entradaSaida =='entrada';
    }


}
