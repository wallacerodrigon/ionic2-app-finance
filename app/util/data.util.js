export class DataUtil {
    parseData(string) {
        let parts = string.split('-');
        return new Date(parts[0], parts[1]-1, parts[2]);
    }

    parseString(data) {
        return new Date(data).toLocaleDateString();
    }


    getDate() {
        let data   = new Date();
        let inicio = "00";
        let year   = data.getFullYear();
        let month  = (inicio + (data.getMonth() + 1)).slice(-inicio.length);
        let day    = (inicio + (data.getDate())).slice(-inicio.length);
        return year + '-' + month + '-' + day;
    }

    formatDate(milliseconds) {
        let data   = new Date(milliseconds);
        let inicio = "00";
        let year   = data.getFullYear();
        let month  = (inicio + (data.getMonth() + 1)).slice(-inicio.length);
        let day    = (inicio + (data.getDate())).slice(-inicio.length);
        return year + '-' + month + '-' + day;
    }

    getMonthName(data) {
        let meses = ['Janeiro', 'Feveiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
        return meses[data.getMonth()];
    }

    getFirstDay(data) {
        let year  = data.getFullYear();
        let month = data.getMonth();
        return new Date(year, month, 1);
    }

    getLastDay(data) {
        let year  = data.getFullYear();
        let month = data.getMonth() + 1;
        return new Date(year, month, 0);
    }
}