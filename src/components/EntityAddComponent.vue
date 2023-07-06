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
                <span class="topbar__action-title">Agregar entidad</span>
            </div>
        </template>
        <div class="entity-add">
            <form @submit="addProperty">
                <div class="fields">
                    <div class="field">
                        <input 
                            v-model="entitySave.name"
                            class="field__input" 
                            required
                            type="text" 
                            placeholder="Nombre de la entidad">
                    </div>
                    <div class="field">
                        <select required v-model="entitySave.currency" class="field__input select">
                            <option value="PEN">PEN</option>
                            <option value="USD">USD</option>
                        </select>
                    </div>
                    <div class="two-columns">
                        <div class="field">
                            <input 
                                @blur="isValidAmount"
                                v-model="entitySave.amountMin"
                                class="field__input" 
                                required
                                min="1"
                                step="any"
                                type="number" 
                                placeholder="Monto min">
                        </div>
                        <div class="field">
                            <input 
                                @blur="isValidAmount"
                                v-model="entitySave.amountMax"
                                class="field__input" 
                                required
                                min="1"
                                step="any"
                                type="number" 
                                placeholder="Monto max">
                        </div>
                    </div>
                    <div v-if="showAmountError" class="error"><span>Error:</span> Monto minimo debe ser menor al monto maximo!</div>
                    <div class="field">
                        <input 
                            @blur="isValidDeadline"
                            v-model="entitySave.deadlineMin"
                            class="field__input" 
                            type="number" 
                            required
                            min="5"
                            pattern="^[0-9]*[05]$"
                            step="5"
                            placeholder="Plazo min">
                    </div>
                    <div class="field">
                        <input 
                        @blur="isValidDeadline"
                            v-model="entitySave.deadlineMax"
                            class="field__input" 
                            type="number" 
                            required
                            min="5"
                            pattern="^[0-9]*[05]$"
                            step="5"
                            placeholder="Plazo max">
                    </div>
                    <div v-if="showDeadlineError.show" class="error"><span>Error: </span>{{ showDeadlineError.message }}</div>
                    <div class="field">
                        <select required v-model="entitySave.annualRateType" class="field__input select">
                            <option value="NOMINAL">Nominal</option>
                            <option value="EFECTIVA">Efectiva</option>
                        </select>
                    </div>
                    <div class="field">
                        <input 
                            @blur="isValidAnnualRate"
                            v-model="entitySave.annualRateMin"
                            class="field__input" 
                            type="number" 
                            required
                            step="0.1"
                            placeholder="Tasa anual min">
                    </div>
                    <div class="field">
                        <input 
                            @blur="isValidAnnualRate"
                            v-model="entitySave.annualRateMax"
                            class="field__input" 
                            required
                            type="number" 
                            step="0.1"
                            placeholder="Tasa anual max">
                    </div>
                    <div v-if="showAnnualRateError" class="error"><span>Error: </span>Tasa anual minima debe ser menor a tasa anual maxima! </div>
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
    import EntitySaveResource from '../models/entitySaveResource';
    import { useEntityStore } from '../stores/entities';

    let dialog = ref(false);
    let showAmountError = ref(false);
    let showAnnualRateError = ref(false);
    let showDeadlineError = ref({show: false, message: ''});
    const entities = useEntityStore();
    let entitySave = ref(new EntitySaveResource());

    const resetForm = () => {
        entitySave.value.amountMax = null;
        entitySave.value.amountMin = null;
        entitySave.value.annualRateMax = null;
        entitySave.value.annualRateMin = null;
        entitySave.value.annualRateType = "EFECTIVA";
        entitySave.value.currency = "PEN";
        entitySave.value.deadlineMax = null;
        entitySave.value.deadlineMin = null;
        entitySave.value.name = '';

        showAmountError.value = false;
        showAnnualRateError.value = false;
        showDeadlineError.value.show = false;
    }

    const goBack = () => {
        resetForm();
        dialog.value = !dialog.value;
    }
    const addProperty = () => {
        event?.preventDefault();

        entities.saveEntity(entitySave.value).then(
            () => { 
                resetForm();
                dialog.value = false;
             },
            (error) => { console.log(error); }
        );    
    }
    const isValidAmount = () => {
        if (entitySave.value.amountMax != null && entitySave.value.amountMin) {
            if (entitySave.value.amountMax <= entitySave.value.amountMin) {
                showAmountError.value = true;
                return false;
            } else {
                showAmountError.value = false;
                return true;
            }
        }
        return false;
    }
    const isValidDeadline = () => {
        if (entitySave.value.deadlineMax != null && entitySave.value.deadlineMin) {
            if (entitySave.value.deadlineMin % 5 !== 0) {
                showDeadlineError.value.show = true;
                showDeadlineError.value.message = "Plazo minimo debe ser multiplo de 5!";
                return false;
            } else {
                showDeadlineError.value.show = false;
            }

            if (entitySave.value.deadlineMax % 5 !== 0) {
                showDeadlineError.value.show = true;
                showDeadlineError.value.message = "Plazo maximo debe ser multiplo de 5!";
                return false;
            } else {
                showDeadlineError.value.show = false;
            }

            if (entitySave.value.deadlineMax <= entitySave.value.deadlineMin) {
                showDeadlineError.value.show = true;
                showDeadlineError.value.message = "Plazo maximo debe mayor al plazo minimo!";
                return false;
            } else {
                showAmountError.value = false;
            }
            return true;
        }
        return false;
    }

    const isValidAnnualRate = () => {
        if (entitySave.value.annualRateMax != null && entitySave.value.annualRateMin) {
            if (entitySave.value.annualRateMax <= entitySave.value.annualRateMin) {
                showAnnualRateError.value = true;
                return false;
            } else {
                showAnnualRateError.value = false;
                return true;
            }
        }
        return false;
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

    .entity-add {
        width: 418px;
        border-radius: 8px;
        background-color: white;
        padding: 30px;
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

    .select{
        color: var(--gray-dark);
        appearance: auto;
        -webkit-appearance: listbox;
    }

    .image {
        height: 207px;
        background-color: var(--gray-light);
        display: flex;
        align-items: center;
        justify-content: center;
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

    .error {
        background-color: var(--error);
        color: white;
        border-radius: 4px;
        padding: 4px 8px;
        margin-top: -8px;
        margin-bottom: 8px;
        font-size: 12px;
        text-align: center;
    }

    .error span {
        font-weight: bold;
    }
</style>