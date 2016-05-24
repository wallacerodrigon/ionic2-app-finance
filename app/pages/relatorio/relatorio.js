import {Page, NavController, NavParams} from "ionic-angular";
import {DAOLancamentos} from "../../dao/dao-lancamentos";
import {DataUtil} from "../../util/data.util";

@Page({
    templateUrl: 'build/pages/relatorio/relatorio.html',
})
export class RelatorioPage {
    static get parameters() {
        return [[NavController], [NavParams]];
    }

    constructor(nav, params) {
        this.nav          = nav;
        this.dao          = new DAOLancamentos();
        this.entradaSaida = 'entrada';
        this.dataFiltro   = params.get('parametro');
        this._getList(this.entradaSaida);
    }

    _getList(entradaSaida) {
        this.dataUtil = new DataUtil();
        let startDate = this.dataUtil.getFirstDay(this.dataFiltro);
        let endDate   = this.dataUtil.getLastDay(this.dataFiltro);
        console.log('Relatório', startDate.getTime(), endDate.getTime());
        this.dao.getListGroupByConta(startDate, endDate, entradaSaida, data=> {
            console.log(data);
            this.contas = data;
            this._calcPercentual();
        });
    }

    _calcTotal() {
        let total = 0;
        for (let i = 0; i < this.contas.length; i++) {
            total += this.contas[i].saldo;
        }
        return total;
    }

    _calcPercentual() {
        let total = this._calcTotal();
        for (let i = 0; i < this.contas.length; i++) {
            this.contas[i].percentual = (this.contas[i].saldo / total ) * 100;
        }
    }

    onSelect(entradaSaida) {
        this._getList(entradaSaida);
    }
}
