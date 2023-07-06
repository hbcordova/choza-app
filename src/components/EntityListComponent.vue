<template>
    <div class="entity-view">
        <div class="topbar">
            <div class="topbar__header">
                <BankIcon class="topbar__header-logo" />
                <span class="topbar__header-title">Entidades Financieras</span>
            </div>
            <EntityAddComponent v-if="useAuth.isAdmin()" class="topbar__action"></EntityAddComponent>
        </div>
        <div class="entities">
            <EntityItemComponent v-for="entity in useEntities.entities" :entity="entity" v-on:remove-item="removeItem"></EntityItemComponent>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import BankIcon from '../components/icons/BankIcon.vue';
    import EntityAddComponent from './EntityAddComponent.vue';
    import EntityItemComponent from './EntityItemComponent.vue';
    import { useEntityStore } from '../stores/entities';
    import { useAuthStore } from '../stores/auth';

    let useAuth = useAuthStore();
    let useEntities = useEntityStore();

    useEntities.getAll();
    
    const removeItem = (id: number) => {
        useEntities.delete(id);
    }

</script>

<style scoped>

    .entity-view {
        max-width: 880px;
        width: 100%;
    }

    .topbar {
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

    .topbar__action-logo {
        width: 18px;
        fill: white;
        margin-right: 12px;
    }

    .topbar__action-title {
        font-size: 20px;
        color: white;
    }   

    .expand-panel {
        border-radius: 8px;
    }
</style>