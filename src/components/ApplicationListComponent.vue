<template>
    <div class="application-view">
        <div class="topbar">
            <div class="topbar__header">
                <BellIcon class="topbar__header-logo" />
                <span class="topbar__header-title">Solicitudes</span>
            </div>
        </div>
        <div class="applications">
            <p style="text-align: center;">Aqui apareceran las solicitudes!</p>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import BellIcon from './icons/BellIcon.vue';
</script>

<style scoped>

    .application-view {
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
        width: 28px;
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
</style>