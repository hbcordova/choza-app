<template>
    <v-row justify="center">
      <v-dialog
        v-model="dialog"
        persistent
        width="auto"
      >
        <template v-slot:activator="{ props }">
            <div class="topbar__action" v-bind="props">
                <PlusIcon class="topbar__action-logo"/>
                <span class="topbar__action-title">Agregar propiedad</span>
            </div>
        </template>
        <div class="property-add">
            <form @submit="addProperty">
                <div v-if="saveProperty.urlPhoto.length <= 0" class="image">
                    <PlusIcon class="icon" />
                </div>
                <div v-else class="image">
                    <img class="photo" :src="saveProperty.urlPhoto" alt="Photo of Property">
                </div>
                <div class="fields">
                    <div class="field">
                        <input 
                            v-model="saveProperty.urlPhoto"
                            required
                            minlength="1"
                            class="field__input" 
                            type="text" 
                            placeholder="Foto de propiedad">
                    </div>
                    <div class="field">
                        <input 
                            v-model="saveProperty.name"
                            required
                            minlength="1"
                            maxlength="30"
                            class="field__input" 
                            type="text" 
                            placeholder="Nombre de la propiedad">
                    </div>
                    <div class="field">
                        <MapIcon class="field__icon" />
                        <input 
                            v-model="saveProperty.ubication" 
                            required
                            minlength="1"
                            maxlength="60"
                            class="field__input" 
                            type="text" 
                            placeholder="Ubicación">
                    </div>
                    <div class="two-columns">
                        <div class="field">
                            <ArrowRightIcon class="field__icon" />
                            <input 
                                v-model="saveProperty.width" 
                                min="1"
                                required
                                class="field__input" 
                                type="number" 
                                placeholder="Ancho">
                        </div>
                        <div class="field">
                            <ArrowTopIcon class="field__icon" />
                            <input 
                                v-model="saveProperty.length" 
                                min="1"
                                required
                                class="field__input" 
                                type="number" 
                                placeholder="Alto">
                        </div>
                    </div>
                    <div class="field">
                        <BedIcon class="field__icon" />
                        <input 
                            v-model="saveProperty.bedrooms" 
                            min="1"
                            required
                            class="field__input" 
                            type="number" 
                            placeholder="Numero de habitaciones">
                    </div>
                    <div class="two-columns">
                        <div class="field">
                            <DolarIcon class="field__icon" />
                            <input 
                                v-model="saveProperty.price" 
                                min="1"
                                inputmode="numeric"
                                step="0.1"
                                required
                                class="field__input" 
                                type="number" 
                                placeholder="Precio">
                        </div>
                        <div class="field">
                            <select 
                                v-model="saveProperty.currency" 
                                required
                                class="field__input currency__select" 
                                placeholder="Moneda" 
                                name="select-currency">
                                <option value="PEN">PEN</option>
                                <option value="USD">USD</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="actions">
                    <input type="button" class="btn btn-cancel" @click="goBack" value="Cancelar"> 
                    <input type="submit" class="btn btn-add" value="Agregar">
                </div>
            </form>
        </div>
      </v-dialog>
    </v-row>
</template>

<script lang="ts" setup>
    import { ref } from 'vue';
    import PlusIcon from './icons/PlusIcon.vue';
    import MapIcon from './icons/MapIcon.vue';
    import ArrowRightIcon from './icons/ArrowRightIcon.vue';
    import ArrowTopIcon from './icons/ArrowTopIcon.vue';
    import DolarIcon from './icons/DolarIcon.vue';
    import BedIcon from './icons/BedIcon.vue';
    import PropertySaveResource from '../models/propertySaveResource';
    import { usePropertyStore } from '../stores/properties';

    let dialog = ref(false);

    let saveProperty = ref(new PropertySaveResource());


    const goBack = () => {
        resetForm();
        dialog.value = !dialog.value;
    }

    const resetForm = () => {
        saveProperty.value.bedrooms = null;
        saveProperty.value.currency = "PEN";
        saveProperty.value.length = null;
        saveProperty.value.name = '';
        saveProperty.value.price = null;
        saveProperty.value.ubication = '';
        saveProperty.value.urlPhoto = '';
        saveProperty.value.width = null;
    }

    const addProperty = () => {
        event?.preventDefault();

        const properties = usePropertyStore();

        properties.saveProperty(saveProperty.value).then(
            () => {
                resetForm();
                dialog.value = false;
            },
            (error) => {
                console.log(error);                
            }
        );
    }
</script>

<style scoped>
    .topbar__action-logo {
        height: 16px;
        fill: white;
        margin-right: 12px;
    }

    .topbar__action-title {
        font-size: 20px;
        color: white;
    }

    .property-add {
        width: 418px;
        border-radius: 8px;
        background-color: white;
        padding: 30px;
    }

    .fields {
        margin-top: 30px;
    }

    .two-columns {
        display: flex;
    }

    .field {
        padding: 10px 16px;
        border: 1px solid var(--gray-light);
        margin-bottom: 16px;
        border-radius: 4px;
        width: 100%;

        display: flex;
        align-items: center ;
    }

    .field__icon {
        margin-right: 16px;
        fill: var(--gray-light);
    }

    .field__input {
        width: 100%;
        outline: none;
    }

    .currency__select {
        appearance: auto;
        -webkit-appearance: listbox;
        color: var(--gray-dark);
    }

    .currency__select option{
        margin: 10px;
        text-align: center;
        color: var(--gray-dark);
    }

    .image {
        height: 207px;
        background-color: var(--gray-light);
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
    }

    .icon {
        width: 40px;
        fill: white;    
    }

    .actions {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
    }

    .btn {
        border: none;
        padding: 8px;
        border-radius: 4px;
    }

    .btn-add {
        color: white;
        background-color: var(--primary-color);
    }

    .btn-cancel {
        color: var(--gray-light);
    }

    .btn-cancel:hover {
        color: var(--primary-color);
    }

    .image img {
        max-width: 100%;
        max-height: 100%;
        object-fit: cover;

        position: absolute;
        width: 100%;
        height: 100%;
    }
</style>