import { defineStore } from "pinia";
import EntityResource from "../models/entityResource";
import EntityService from '../services/entitiesService';
import EntitySaveResource from "../models/entitySaveResource";

export const useEntityStore = defineStore('entities', {
    state: () => ({
        _entities: new Array<EntityResource>()
    }),
    getters: {
        entities: (state) => state._entities,
    },
    actions: {
        getAll() {
            return EntityService.getAll().then(
                (response) => {
                    this._entities = [...response.data];
                }
            )
        },
        getById(id: number) {
            return this._entities.find((property) => property.id === id);
        },
        saveEntity(newEntity: EntitySaveResource) {
            return EntityService.post(newEntity).then(
                (response) => {
                    this._entities.push(response.data);
                    return Promise.resolve(response.data);
                },
                (error) => {
                    return Promise.reject(error);
                }
            )
        },
        delete(id: number) {
            return EntityService.delete(id).then(
                (response) => { 
                    let newEntities =  this._entities.filter((entity => entity.id != id));
                    this._entities = [...newEntities];
                    return Promise.resolve(response.data);
                },
                (error) => { return Promise.reject(error); }
            );
        }
    }
});