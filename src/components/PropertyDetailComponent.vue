<template>
    <div>
        <div class="topbar">
            <div class="topbar__header">
                <PropertyIcon class="topbar__header-logo" />
                <span class="topbar__header-title"><span class="cursor-point" @click="goBack()">Propiedades</span> / {{ property.name }}</span>
            </div>
        </div>
        <div class="property-description">
            <div class="principal-description">
                <div class="container-image">
                    <img :src="property.urlPhoto" :alt="property.name + ' photo'">
                </div>
                <div class="actions-details">
                    <div class="container__details">
                        <span class="container__details-name">{{ property.name }}</span>
                        <span class="container__details-price">{{ Intl.NumberFormat('en-US').format(property.price) }} {{ property.currency }}</span>
                    </div>
                    <div class="container__actions">
                        <button v-if="user.isAdmin()" class="btn container__actions-delete">Eliminar</button>
                        <button v-else class="btn container__actions-apply">Solicitar</button>
                        <button @click="goToFormPayment()" class="btn container__actions-finance">Ir a financiar</button>
                    </div>
                </div>
            </div>
            <div class="aditional-description">
                <div class="property__content-address">
                    <MapIcon class="logo" />
                    <span>{{ property.ubication }}</span>
                </div>
                <div class="two-columns">
                    <div class="property__content-area">
                        <BuildIcon class="logo" />
                        <span>{{ property.width }}m x {{ property.length }}m</span>
                    </div>
                    <div class="property__content-bedrooms">
                        <BedIcon class="logo" />
                        <span>{{ property.bedrooms }} dormitorios</span>
                    </div>
                </div>
            </div>
        </div>
        <div id="payment_component">
            <PaymentScheduleFormComponent :property="property"></PaymentScheduleFormComponent>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { onMounted } from 'vue';
    import { ref } from 'vue';
    import router from '../routes';
    import PropertyIcon from './icons/PropertyIcon.vue';
    import BuildIcon from './icons/BuildIcon.vue';
    import BedIcon from './icons/BedIcon.vue';
    import MapIcon from './icons/MapIcon.vue';
    import PropertyResource from '../models/propertyResource';
    import PropertyService from '../services/propertiesService';
    import PaymentScheduleFormComponent from './PaymentScheduleFormComponent.vue';
    import { useAuthStore } from '../stores/auth';
    

    let property = ref(new PropertyResource());
    const user = useAuthStore();

    const goToFormPayment = () => {
        var div = document.getElementById('payment_component');
        var offset = 100; // Ajuste de compensación en píxeles hacia arriba
        var targetPosition = (div?.offsetTop? div?.offsetTop : 0) - offset; // Posición objetivo teniendo en cuenta la compensación
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth' // La animación suave se activa gracias al scroll-behavior en CSS
        });
    }

    onMounted(async () => {
        const propertyId = router.currentRoute.value.params['id'];

        const propertyIdParsed = typeof(propertyId) === 'string'? Number(propertyId) : 0;

        if (propertyIdParsed !== 0) {       
            await PropertyService.getById(Number(propertyId)).then(
                (response) => {
                    property.value = response.data
                },
                (error) => console.warn(error)
            );
        }
        
    })

    const goBack = () => {
        router.back();
    }
</script>

<style scoped>
    .topbar {
        z-index: 300;
        height: 80px;
        border-radius: 8px;
        background-color: var(--primary-color);
        padding: 23px 36px;
        margin-bottom: 16px;

        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .topbar__header {
        display: flex;
        align-items: center;
    }

    .topbar__header-logo {
        width: 48px;
        fill: white;
        margin-right: 20px;
    }

    .topbar__header-title {
        font-weight: bold;
        font-size: 28px;
        color: white;
    }

    .cursor-point {
        cursor: pointer;
    }

    .container-image {
        position: relative;
        height: 320px;
    }

    .container-image img {
        position: absolute;
        object-fit: cover;
        width: 100%;
        height: 100%;
        border-radius: 4px;
    }

    .property-description {
        border: 1px solid var(--gray-dark);
        border-radius: 8px;
        padding: 24px 32px;
        margin-bottom: 12px;
    }

    .principal-description {
        display: grid;
        grid-template-columns: calc(70% - 32px) 30%;
        column-gap: 32px;
        margin-bottom: 24px;
    }

    .container__actions, .container__details {
        display: flex;
        flex-direction: column;
    }

    .container__actions-apply {
        background-color: var(--seconday-color);
    }

    .container__actions-delete {
        background-color: var(--error);
    }

    .container__actions-apply:hover {
        background-color: var(--primary-color);
    }

    .container__actions-finance {
        background-color: var(--info);
    }

    .container__actions-finance:hover {
        background-color: var(--info-light);
    }

    .container__details {
        display: flex;
        flex-direction: column;
        margin-bottom: 16px;
    }

    .container__details-name {
        font-size: 20px;
        font-weight: bold;
        color: var(--seconday-color);
    }

    .container__details-price {
        color: black;
        font-size: 18px;
        font-weight: bold;
    }

    .btn {
        color: white;
        font-size: 18px;
        padding: 12px;
        border-radius: 4px;
        margin-bottom: 12px;
    }

    .property__content-address {
        margin-bottom: 8px;
    }

    .property__content-address, .property__content-area, .property__content-bedrooms {
        display: flex;
        align-items: center;
    }

    .logo {
        width: 24px;
        margin-right: 12px;
    }

    .two-columns {
        display: grid;
        grid-template-columns: repeat(2, 200px);
    }
</style>