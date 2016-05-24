import {Component, Input, Output, EventEmitter} from "@angular/core";
import {DataUtil} from "../../util/data.util";
/*
 Generated class for the DataFilter component.

 See https://angular.io/docs/ts/latest/api/core/ComponentMetadata-class.html
 for more info on Angular 2 Components.
 */
@Component({
    selector: 'data-filter',
    inputs: ['startDate'],
    outputs: ['changeMonth'],
    templateUrl: 'build/components/data-filter/data-filter.html'
})
export class DataFilter {
    constructor() {
        this.changeMonth = new EventEmitter();
    }

    ngOnInit() {
        this._updateMonth();
    }

    ngOnChanges(changes) {
        this._updateMonth();
    }

    _executeChangeMonth() {
        this.changeMonth.next(this.startDate);
    }

    _updateMonth() {
        let dataUtil        = new DataUtil();
        let ano             = this.startDate.getFullYear();
        this.mesSelecionado = dataUtil.getMonthName(this.startDate) + ' - ' + ano;
        this._executeChangeMonth();
    }

    previousMonth() {
        this.startDate.setMonth(this.startDate.getMonth() - 1);
        this._updateMonth();
    }

    nextMonth() {
        this.startDate.setMonth(this.startDate.getMonth() + 1);
        this._updateMonth();
    }
}
