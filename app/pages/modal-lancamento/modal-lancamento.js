import {Page, ViewController, NavParams, NavController} from "ionic-angular";
import {DAOContas} from "../../dao/dao-contas";
import {DataUtil} from "../../util/data.util";

@Page({
    templateUrl: 'build/pages/modal-lancamento/modal-lancamento.html',
})
export class ModalLancamentoPage {
    static get parameters() {
        return [[ViewController], [NavController], [NavParams]];
    }

    constructor(view, nav, params) {
        this.view      = view;
        this.nav       = nav;
        let lancamento = params.get('parametro');
        console.log(lancamento);
        if (lancamento) {
            this.lancamento = lancamento;
            this.lancamento.data = this.getDate(this.lancamento.data);
        } else {
            this.lancamento = {
                entradaSaida: "entrada",
                valor: 0,
                data: new Date(),
                pago: true
            };
        }
        // Contas
        this.dao = new DAOContas();
        this.dao.list(lista=> {
            this.contas           = lista;
        });
    }

    getDate(data) {
        let dataUtil = new DataUtil();
        return dataUtil.formatDate(data)
    }

    close() {
        this.view.dismiss();
    }

    save() {
        let dataUtil = new DataUtil();
        this.lancamento.data = dataUtil.parseData(this.lancamento.data);
        this.lancamento.valor = parseFloat(this.lancamento.valor);
        this.lancamento.pago  = this.lancamento.pago ? 1 : 0;
        this.view.dismiss(this.lancamento);
    }

}
