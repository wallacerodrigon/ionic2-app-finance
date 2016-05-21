import {Page} from "ionic-angular";


@Page({
    templateUrl: 'build/pages/home/home.html'
})

export class HomePage {
    constructor() {
        this.nome = 'Willian';
    }

    getNome() {
        return 'Retornado pelo método ' + this.nome;
    }
}
