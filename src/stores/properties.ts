import { defineStore } from "pinia";
import PropertyResource from "../models/propertyResource";
import PropertyService from '../services/propertiesService';
import PropertySaveResource from "../models/propertySaveResource";

export const usePropertyStore = defineStore('properties', {
    state: () => ({
        _properties: new Array<PropertyResource>()
    }),
    getters: {
        properties: (state) => state._properties,
    },
    actions: {
        getAll() {
            return PropertyService.getAll().then(
                (response) => {
                    this._properties = [...response.data];
                }
            )
        },
        getById(id: number) {
            return this._properties.find((property) => property.id === id);
        },
        saveProperty(newProperty: PropertySaveResource) {
            return PropertyService.post(newProperty).then(
                (response) => {
                    this._properties.push(response.data);
                    return Promise.resolve(response.data);
                },
                (error) => {
                    return Promise.reject(error);
                }
            )
        }
    }
});