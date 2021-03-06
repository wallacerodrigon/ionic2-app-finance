import {Page, ViewController, NavParams} from "ionic-angular";

@Page({
    templateUrl: 'build/pages/modal-contas/modal-contas.html',
})
export class ModalContasPage {
    static get parameters() {
        return [[ViewController], [NavParams]];
    }

    constructor(view, params) {
        this.view = view;
        this.conta = params.get('parametro') || {descricao: ''};
    }

    close() {
        this.view.dismiss();
    }

    save(conta) {
        this.view.dismiss(conta);
    }
}