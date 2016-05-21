import {Page, Modal, NavController} from "ionic-angular";
import {DAOContas} from "../../dao/dao-contas";
import {ModalContasPage} from "../modal-contas/modal-contas";

@Page({
    templateUrl: 'build/pages/contas/contas.html'
})

export class ContasPage {
    static get parameters() {
        return [[NavController]];
    }

    constructor(nav) {
        this.nav        = nav;
        this.dao        = new DAOContas();
        this.listContas = this.dao.getList();

    }

    insert() {
        let modal = Modal.create(ModalContasPage);

        modal.onDismiss(conta=> {
            console.log('Data', conta);
            this.dao.insert(conta);
        });

        this.nav.present(modal);
    }

    edit(conta) {
        let modal = Modal.create(ModalContasPage, {parametro: conta});
        modal.onDismiss(conta=> {
            this.dao.edit(conta)
        });

        this.nav.present(modal);
    }
    
    delete(conta) {
        this.dao.delete(conta);
    }
}
