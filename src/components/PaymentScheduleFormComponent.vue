<template>
    <div class="container-schedule">
        <v-form class="form" @submit.prevent="calculateSchedule()">
            <div class="fields">
                <v-select
                    variant="outlined"
                    :items="entitiesNames"
                    v-model.lazy="entitySelected"
                    @blur="changeEntitySelected()"
                    :rules="[v => !!v || 'Seleccione una entidad financiera!']"
                    label="Entidad Financiera"
                    required
                ></v-select>
                <div class="two-columns">
                    <v-text-field
                        type="number"
                        disabled
                        v-model.number="currencyShowed.value"
                        :rules="[v => !!v || 'Este campo es requerido']"
                        variant="outlined"
                        label="Monto"
                        :prefix="currencyShowed.name === 'PEN'? 'S/.' : '$'"
                    ></v-text-field>
                    <div class="btn-select">
                        <input type="button" @click="changeCurrency('PEN')" :class="['btn', 'btn-pen', currencyShowed.name === 'PEN'? 'selected': '']" value="PEN">
                        <input type="button" @click="changeCurrency('USD')" :class="['btn', 'btn-usd', currencyShowed.name === 'USD'? 'selected': '']" value="USD">
                    </div>
                </div>
                <div class="two-columns">
                    <v-text-field
                        variant="outlined"
                        suffix="%"
                        min="10"
                        :rules="[v => !!v || 'Este campo es requerido', 
                                    v => v >= 10 || 'Debe ser mayor al 10%']"
                        v-model.number="initialAmmount.percentageInitialAmmount"
                        @blur="changeInitialAmmount()"
                        :disabled="entitySelected === null"
                        label="Porcentaje Monto Inicial"
                    ></v-text-field>
                    <v-text-field
                        disabled
                        v-model.number="initialAmmount.valueInitial"
                        variant="outlined"
                        :rules="[v => !!v || 'Este campo es requerido']"
                        label="Monto Inicial"
                    ></v-text-field>
                </div>
                <div class="two-columns">
                    <v-text-field
                        v-model="rateValue"
                        :disabled="entitySelected === null"
                        :rules="[v => !!v || 'Este campo es requerido', 
                                v => v >= entitySelectedWithData.annualRateMin || `Debe ser mayor o igual a ${entitySelectedWithData.annualRateMin}%`,
                                v => v <= entitySelectedWithData.annualRateMax || `Debe ser menor o igual a ${entitySelectedWithData.annualRateMax}%`]"
                        suffix="%"
                        v-validate="'required'"
                        variant="outlined"
                        label="Tasa de Interez Anual"
                    ></v-text-field>
                    <v-select
                        variant="outlined"
                        @blur="generateTEM()"
                        v-model="rateTypeSelected"
                        :disabled="entitySelected === null"
                        :items="rateTypes"
                        :rules="[v => !!v || 'Este campo es requerido']"
                        label="Tipo de Tasa"
                        required
                    ></v-select>
                </div>
                <div class="two-columns">
                    <v-text-field
                        variant="outlined"
                        label="Plazo de Pago"
                        :disabled="entitySelected === null"
                        @blur="changePeriods()"
                        v-model="deadline.inYears"
                        :rules="[v => !!v || 'Este campo es requerido', 
                                v => v >= entitySelectedWithData.deadlineMin || `Debe ser mayor o igual ${entitySelectedWithData.deadlineMin} años`,
                                v => v <= entitySelectedWithData.deadlineMax || `Debe ser menor o igual ${entitySelectedWithData.deadlineMax} años`]"
                        suffix="años"
                    ></v-text-field>
                    <v-text-field
                        disabled
                        variant="outlined"
                        v-model="deadline.inMonths"
                        suffix="meses"
                        label="Numero de Periodos"
                    ></v-text-field>
                </div>
                <v-select
                    v-model="totalPeriods"
                    :items="initialPeriods"
                    label="Periodos de Gracia Totales"
                    @blur="generateListParcialPeriods()"
                    multiple
                    persistent-hint
                    variant="outlined"
                ></v-select>
                <v-select
                    v-model="parcialPeriods"
                    :items="initialPeriodsParcial"
                    label="Periodos de Gracia Parciales"
                    multiple
                    persistent-hint
                    variant="outlined"
                ></v-select>
            </div>
            <div class="actions">
                <input type="submit" class="btn btn-calc" value="Calcular">
                <div v-if="entitySelectedWithData.name" :class="[isValidForFondoMiVivienda()? 'notification' : 'warning']">
                    <div v-if="isValidForFondoMiVivienda()" class="">
                        <InfoIcon class="info-icon" />
                        <p>Esta propiedad <span class="font-bold">CUMPLE</span> con el criterio del valor total para {{ entitySelectedWithData.name }}.</p>
                    </div>
                    <div v-else class="">
                        <ErrorIcon class="error-icon" />
                        <p>Esta propiedad <span class="font-bold">NO CUMPLE</span> con el criterio del valor total para el Nuevo Fondo MiVivienda</p>
                    </div>
                    <p v-if="entitySelectedWithData.currency === 'PEN'"><span class="font-bold">Monto:</span> {{ entitySelectedWithData.amountMin }} - {{ entitySelectedWithData.amountMax }} soles.</p>
                    <p v-else><span class="font-bold">Monto:</span> {{ convertPENToUSD(entitySelectedWithData.amountMin).toFixed(2) }} - {{ convertPENToUSD(entitySelectedWithData.amountMax).toFixed(2) }} dolares.</p>
                </div>
            </div>
        </v-form>
    </div>
    <div class="container-schedule" v-if="showSchedulePayment">
        <PaymentScheduleComponent 
            :cuota-inicial="currencyShowed.value"
            :monto-inicial="initialAmmount.valueInitial? initialAmmount.valueInitial : 0"
            :plazo-anios="deadline.inYears? deadline.inYears : 0"
            :tasa-efectiva-mensual="TEM"
            :periodos-gracia-totales="totalPeriods"
            :periodos-gracia-parciales="parcialPeriods">
        </PaymentScheduleComponent>
    </div>
</template>

<script lang="ts" setup>
    import { ref } from 'vue';
    import { onMounted } from 'vue';
    import EntityResource from '../models/entityResource';
    import PropertyResource from '../models/propertyResource';
    import EntityService from '../services/entitiesService';
    import PropertyService from '../services/propertiesService';
    // import ExchangeTypeService from '../services/exchangeType';
    import PaymentScheduleComponent from './PaymentScheduleComponent.vue';
    import InfoIcon from './icons/InfoIcon.vue';
    import ErrorIcon from './icons/ErrorIcon.vue';
    import router from '../routes';
    import { Ref } from 'vue';
// import ExchangeTypeResource from '../models/exchangeTypeResource';

    let showSchedulePayment = ref(false);

    interface InitialAmmount {
        percentageInitialAmmount: number | null,
        valueInitial: number | null
    }

    interface Deadline {
        inYears: number | null,
        inMonths: number | null
    }

    let property = ref(new PropertyResource());
    let propertyId: number = Number(router.currentRoute.value.params['id'][0]);
    let currencyShowed = ref({name: '', value: 0});
    let rateTypeSelected: Ref<string | null> = ref(null);
    let rateValue: Ref<number | null> = ref(null);

    let entities: EntityResource[] = [];
    let entitiesNames: Ref<string[]> = ref([]);
    let entitySelected: Ref<string | null> = ref(null);
    let entitySelectedWithData: Ref<EntityResource> = ref(new EntityResource());
    let initialAmmount: Ref<InitialAmmount> = ref({percentageInitialAmmount: null, valueInitial: null});
    let deadline: Ref<Deadline> = ref({inYears: null, inMonths: null});
    let initialPeriods: Ref<number[]> = ref([1, 2, 3, 4, 5, 6]);
    let totalPeriods: Ref<number[]> = ref([]);
    let parcialPeriods: Ref<number[]> = ref([]);
    let initialPeriodsParcial: Ref<number[]> = ref([]);
    let TEM: Ref<number> = ref(0);
    const rateTypes: string[] = ['Nominal', 'Efectiva'];
    // let usdToPenChange: ExchangeTypeResource;
    
    // const getUsdChange = () => {
    //     ExchangeTypeService.getByDate().then(
    //         (response) => usdToPenChange = response.data,
    //         (error) => console.log(error)
    //     )
    // }

    const changeCurrency = (currency: string) => {
        if (property.value.currency !== currency) {
            if (property.value.currency === 'PEN') {
                currencyShowed.value.name = 'USD';
                currencyShowed.value.value = Number((property.value.price / 3.6).toFixed(2));
            } else if (property.value.currency === 'USD') {
                currencyShowed.value.name = 'PEN';
                currencyShowed.value.value = Number((property.value.price * 3.6).toFixed(2));
            }
        } else {
            currencyShowed.value.name = property.value.currency;
            currencyShowed.value.value = property.value.price;
        }

        changeInitialAmmount();
    }

    const changeInitialAmmount = () => {
        if (initialAmmount.value.percentageInitialAmmount === null) return;
        initialAmmount.value.valueInitial = currencyShowed.value.value * (initialAmmount.value.percentageInitialAmmount / 100);
    }

    const changePeriods = () => {
        if (deadline.value.inYears === null) return;
        deadline.value.inMonths = deadline.value.inYears * 12;
    }

    const generateListParcialPeriods = () => {
        initialPeriodsParcial.value = initialPeriods.value.filter((element) => !totalPeriods.value.includes(element));
    }

    const changeEntitySelected = () => {
        if (entitySelected != null) {
            entitySelectedWithData.value = entities.find((entity) => entity.name === entitySelected.value) || new EntityResource();     
        }
    }

    const convertPENToUSD = (amount: number) => {
        return amount / 3.6;
    }

    const isValidForFondoMiVivienda = () => {
        if (property.value.currency === 'PEN') {
            if (entitySelectedWithData.value.currency === 'PEN') {
                if (property.value.price >= entitySelectedWithData.value.amountMin &&
                    property.value.price <= entitySelectedWithData.value.amountMax) return true;
                else return false;
            } else if (entitySelectedWithData.value.currency === 'USD') {
                if (convertPENToUSD(property.value.price) >= entitySelectedWithData.value.amountMin &&
                    convertPENToUSD(property.value.price) <= entitySelectedWithData.value.amountMax) return true;
                else return false;
            } 
            return false;
        } else if (property.value.currency === 'USD') {
            if (entitySelectedWithData.value.currency === 'PEN') {
                if (property.value.price >= convertPENToUSD(entitySelectedWithData.value.amountMin) &&
                    property.value.price <= convertPENToUSD(entitySelectedWithData.value.amountMax)) return true;
                else return false;
            } else if (entitySelectedWithData.value.currency === 'USD') {
                if (property.value.price >= entitySelectedWithData.value.amountMin &&
                    property.value.price <= entitySelectedWithData.value.amountMax) return true;
                else return false;
            } 
            return false;
        }
        return false;
    }

    const calculateTEA = (tasaNominalAnual: number): number => {

        // Convertir la tasa nominal anual a decimal y dividir por 12 para obtener la tasa mensual
        const tasaMensual = tasaNominalAnual / 12 / 100;

        // Calcular la tasa efectiva anual utilizando la fórmula (1 + tasaMensual)^12 - 1
        const tasaEfectivaAnual = (Math.pow(1 + tasaMensual, 12) - 1) * 100;

        // Redondear la tasa efectiva anual a 4 decimales
        const tasaEfectivaAnualRedondeada = Number(tasaEfectivaAnual.toFixed(4));

        // Devolver la tasa efectiva anual
        return Number(tasaEfectivaAnualRedondeada);
    }

    const calculateTEM = (TEA: number): number => {
        const TEADecimal = TEA / 100;

        // Calcular la tasa efectiva mensual utilizando la fórmula (1 + TEADecimal)^(1/12) - 1
        const TEM = (Math.pow(1 + TEADecimal, 1 / 12) - 1) * 100;

        // Redondear la tasa efectiva mensual a 4 decimales
        const TEMRedondeada = Number(TEM.toFixed(4));

        // Devolver la tasa efectiva mensual
        return TEMRedondeada;
    }

    const generateTEM = () => {
        if (rateTypeSelected.value !== null && rateValue.value !== null) {
            if (rateTypeSelected.value === 'Nominal') {
                const TEA = calculateTEA(rateValue.value);
                TEM.value = calculateTEM(TEA);
            } else if (rateTypeSelected.value === 'Efectiva') {
                TEM.value = calculateTEM(rateValue.value);
            }
        }
    }

    const calculateSchedule = () => {

        if (entitySelected.value && 
            currencyShowed.value.value && 
            initialAmmount.value.percentageInitialAmmount &&
            initialAmmount.value.percentageInitialAmmount >= 10 &&
            rateValue.value &&
            rateValue.value >= entitySelectedWithData.value.annualRateMin &&
            rateValue.value <= entitySelectedWithData.value.annualRateMax &&
            rateTypeSelected.value &&
            deadline.value.inYears &&
            deadline.value.inYears &&
            deadline.value.inYears >= entitySelectedWithData.value.deadlineMin &&
            deadline.value.inYears <= entitySelectedWithData.value.deadlineMax &&
            deadline.value.inMonths) {
                showSchedulePayment.value = false;
                setTimeout(() => {
                    showSchedulePayment.value = true;
                }, 100);
        }
        else showSchedulePayment.value = false;
        
    }

    onMounted(async () => {

        await PropertyService.getById(propertyId).then(
            (response => {
                property.value = response.data;
                currencyShowed.value.name = response.data.currency;
                currencyShowed.value.value = response.data.price;
            }),
            (error) => console.warn(error)
        );

        await EntityService.getAll().then(
            (response) => entities = response.data,
            (error) => console.warn(error)
        );

        // await getUsdChange();

        entitiesNames.value = entities.map((entity => entity.name));
    })

</script>

<style scoped>

    .font-bold {
        font-weight: bold;
    }

    .info-icon {
        fill: var(--info);
        width: 24px;
    }

    .error-icon {
        width: 24px;
        fill: var(--warning);
    }

    .notification {
        color: var(--info);
        background-color: #cae1f9;
        padding: 10px;
        border-radius: 4px;
        font-size: 12px;
    }

    .warning {
        color: var(--warning);
        background-color: #f9d5b3;
        padding: 10px;
        border-radius: 4px;
        font-size: 12px;
    }

    .container-schedule {
        border: 1px solid var(--gray-dark);
        border-radius: 8px;
        margin: 0 0 16px 0;
        padding: 40px 32px;
    }

    .fields {
        display: flex;
        flex-direction: column;
        row-gap: 16px;
    }

    .two-columns {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-template-rows: 1fr;
        column-gap: 12px;
    }

    .form {
        display: grid;
        grid-template-columns: calc(70% - 32px) 30%;
        column-gap: 32px;
    }

    .btn-select {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
    }

    .btn {
        border: 1px solid var(--gray-dark);
        height: 56px;
        border-radius: 4px;
        color: var(--gray-dark);
    }

    .selected {
        background-color: var(--success);
        border-color: var(--success);
        color: white;
    }

    .btn-pen {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
    }

    .btn-usd {
        border-bottom-left-radius: 0;
        border-top-left-radius: 0;
    }

    .btn-calc {
        background-color: var(--seconday-color);
        color: white;
    }

    .btn-calc:hover {
        background-color: var(--primary-color);
    }

    .actions {
        width: 100%;
        display: flex;
        flex-direction: column;
        row-gap: 12px;
    }
</style>