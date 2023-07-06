import http from '../core/http-common';
import PropertyResource from '../models/propertyResource';
import PropertySaveResource from '../models/propertySaveResource';

class PropertiesService {
    BASE_URL = 'http://localhost:3000/properties';

    getAll() {
        return http.get<Array<PropertyResource>>(this.BASE_URL);
    }

    getById(id: number) {
        return http.get<PropertyResource>(`${this.BASE_URL}/${id}`);
    }

    post(saveProperty: PropertySaveResource) {
        return http.post<PropertyResource>(this.BASE_URL, saveProperty);
    }

}

export default new PropertiesService();