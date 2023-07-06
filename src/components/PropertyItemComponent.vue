<template>
    <div class="property">
        <div class="property__image">
            <img width="180" height="124" :src="property.urlPhoto" alt="Image Department">
        </div>
        <div class="property__description">
            <h2 class="property__description-title">{{ property.name }}</h2>
            <div class="property__content">
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
        <div class="property__price">
            <span>{{ Intl.NumberFormat('en-US').format(property.price) }} {{ property.currency }}</span>
        </div>
    </div>
</template>

<script lang="ts" setup>
import BedIcon from './icons/BedIcon.vue';
import BuildIcon from './icons/BuildIcon.vue';
import MapIcon from './icons/MapIcon.vue';

const { property } = defineProps(["property"]);

</script>

<style scoped>
    .property {
        position: relative;
        height: 168px;
        border: 1px solid var(--gray-light);
        border-radius: 8px;
        padding: 22px 32px;
        margin-bottom: 16px;

        transition: transform 0.3s linear;

        display: flex;
        align-items: center;
    }

    .property:hover {
        cursor: pointer;
        transform: scale(1.01);
    }

    .property__image {
        margin-right: 40px;
        background-color: rebeccapurple;
        width: 180px;
        height: 124px;
        position: relative;
    }

    .property__image img {
        position: absolute;
        object-fit: cover;
        width: 100%;
        height: 100%;
    }

    .property__description-title {
        margin-top: 0;
        margin-bottom: 12px;
    }

    .two-columns {
        display: grid;
        grid-template-columns: repeat(1, 1fr);
        grid-template-rows: repeat(2, 1fr);
    }

    @media(min-width: 918px) {
        .two-columns {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
        }
    }

    .property__content-address {
        margin-bottom: 8px;
    }

    .property__content-address, .property__content-area, .property__content-bedrooms {
        display: flex;
        align-items: center;
    }

    .property__content-address span, .property__content-area span,  .property__content-bedrooms span{
        font-size: 18px;
        font-weight: 500;
    }

    .property__price {
        position: absolute;
        left: 0;
        top: 14px;
        padding: 0 30px;
        height: 28px;
        background-color: var(--warning);
        color: white;
        font-size: 16px;
        font-weight: bold;

        display: flex;
        align-items: center;
    }

    .logo {
        width: 20px;
        margin-right: 16px;
    }
</style>