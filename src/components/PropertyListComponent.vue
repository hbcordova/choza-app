<template>
    <div class="property-list">
        <div class="topbar">
            <div class="topbar__header">
                <PropertyIcon class="topbar__header-logo" />
                <span class="topbar__header-title">Propiedades</span>
            </div>
            <PropertyAddComponent v-if="user.isAdmin()" class="topbar__action"></PropertyAddComponent>
        </div>
        <div class="properties">
            <PropertyItemComponent @click="goToDetail(property.id)" v-for="property in properties.properties" :property="property"></PropertyItemComponent>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import PropertyIcon from '../components/icons/PropertyIcon.vue';
    import PropertyItemComponent from './PropertyItemComponent.vue';
    import PropertyAddComponent from './PropertyAddComponent.vue';
    import { useAuthStore } from '../stores/auth';
    import { usePropertyStore } from '../stores/properties';
import router from '../routes';

    const user =  useAuthStore();

    const properties = usePropertyStore();

    properties.getAll();

    const goToDetail = (id: number) => {
        router.push(`/home/properties/${id}`).catch(() => {});
    }
    

    
</script>

<style scoped>

    .property-list {
        max-width: 880px;
        width: 100%;
    }
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

    .topbar__action {
        padding: 8px 16px;
        border: 2px solid white;
        border-radius: 4px;
        max-width: max-content;

        display: flex;
        align-items: center;
    }

    .topbar__action:hover {
        cursor: pointer;
    }

</style>