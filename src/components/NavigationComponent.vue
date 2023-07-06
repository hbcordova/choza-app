<template>
    <div class="fixed">
        <div class="navigation">
            <div class="container">
                <router-link to="/">
                    <ChozaLogo class="logo" />
                </router-link>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import ChozaLogo from '../components/icons/ChozaLogo.vue';
</script>

<style scoped>
    .navigation {
        position: fixed;
        display: flex;
        align-items: center;
        left: 0;
        top: 0;
        width: 100%;
        height: 90px;
        background-color: white ;
        box-shadow: 0px 4px 4px var(--primary-color);
        z-index: 999;
    }

    .fixed {
        box-sizing: border-box;
        width: 100%;
        background-color: white;
        display: flex;
    }

    .container {
        width: 100%;
        max-width: 1200px;
    }

    .logo {
        height: 41px;
    }

</style>