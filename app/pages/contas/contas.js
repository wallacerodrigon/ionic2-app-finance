import {Page, Modal, Alert, NavController} from "ionic-angular";
import {Toast} from "ionic-native";
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
        this.nav = nav;
        this.dao = new DAOContas();
        this.dao.list(lista=> {
            this.list = lista;
        });

    }

    insert() {
        let modal = Modal.create(ModalContasPage);

        modal.onDismiss(conta=> {
            if (conta) {
                this.dao.insert(conta, newConta=> {
                    this.list.push(newConta);
                    Toast.showShortBottom('Conta adicionada').subscribe(text=>console.log(text));
                });
            }
        });

        this.nav.present(modal);
    }

    edit(conta) {
        let modal = Modal.create(ModalContasPage, {parametro: conta});
        modal.onDismiss(conta => {
            this.dao.updae(conta, data=> {
                console.log('Edit', conta);
                Toast.showShortBottom('Conta editada').subscribe(text=>console.log(text));
            })
        });

        this.nav.present(modal);
    }

    delete(conta) {
        let confirm = Alert.create({
            title: 'Excluir',
            body: 'Gostaria de realmente excluir a conta ' + conta.descricao + "?",
            buttons: [
                {
                    text: 'Sim',
                    handler: ()=> {
                        this.dao.delete(conta, data=> {
                            let pos = this.list.indexOf(conta);
                            this.list.splice(pos, 1);
                            Toast.showShortBottom('Conta deletada').subscribe(text=>console.log(text));
                        });
                    }
                },
                {
                    text: 'Não'
                },
            ]
        });
        this.nav.present(confirm)


    }
}
