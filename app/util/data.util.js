export class DataUtil {
    parseData(string) {
        let parts = string.split('-');
        return new Date(parts[0], parts[1], parts[2]).getTime();
    }

    parseString(data) {
        return new Date(data).toLocaleDateString();
    }

    formatDate(milliseconds) {
        let data   = new Date(milliseconds);
        let inicio = "00";
        let year   = data.getFullYear();
        let month  = (inicio + (data.getMonth() + 1)).slice(-inicio.length);
        let day    = (inicio + (data.getDay())).slice(-inicio.length);
        return year + '-' + month + '-' + day;
    }
}