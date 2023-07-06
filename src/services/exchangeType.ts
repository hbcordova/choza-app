import http from '../core/http-common';
import ExchangeTypeResource from '../models/exchangeTypeResource';

const date = new Date();

const year = date.getFullYear();
const month = ('0' + (date.getMonth() + 1)).slice(-2);
const day = ('0' + date.getDate()).slice(-2);

const dateFormated = year + '-' + month + '-' + day;

const token = "apis-token-4717.zGqLSGWOJot2F82hslJ-Ft3seytSCs-D";

// Configurar encabezados de Axios para permitir CORS
// axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
// axios.defaults.headers.common['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS';
// axios.defaults.headers.common['Access-Control-Allow-Headers'] = 'POST, GET, PUT, DELETE, OPTIONS, HEAD, Authorization, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Access-Control-Allow-Origin';

class ExchangeTypeService {
    BASE_URL = 'https://api.apis.net.pe/v1/tipo-cambio-sunat';

    getByDate(fecha: string = dateFormated) { //fecha formato: 2023-05-12
        return http.get<ExchangeTypeResource>(`${this.BASE_URL}?fecha=${fecha}`, { headers: {'Authorization': `Bearer ${token}`}});
    }

}

export default new ExchangeTypeService();