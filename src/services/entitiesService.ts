import http from '../core/http-common';
import EntitySaveResource from '../models/entitySaveResource';

class EntitiesService {
    BASE_URL = 'http://localhost:3000/entities';

    getAll() {
        return http.get(this.BASE_URL);
    }

    post(saveEntity: EntitySaveResource) {
        return http.post(this.BASE_URL, saveEntity);
    }

    delete(id: number) {
        return http.delete(`${this.BASE_URL}/${id}`);
    }

}

export default new EntitiesService();