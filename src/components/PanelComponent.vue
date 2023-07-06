<template>
    <div class="container">
        <div class="panel">
            <div class="aside">
                <AsideNavigation />
            </div>
            <div class="content">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import AsideNavigation from '../components/AsideNavigation.vue';
</script>

<style scoped>
    .panel {
        display: grid;
        grid-template-columns: repeat(1, 1fr);
        column-gap: 20px;
        margin-top: 120px;
    }

    @media(min-width: 918px) {
        .panel {
            grid-template-columns: 300px auto;
            grid-template-rows: auto;
            column-gap: 20px;
            margin-top: 120px;
        }
    }

    .aside {
        position: fixed;
        display: none;
        margin-bottom: 30px;
    }

    @media (min-width: 918px) {
        .aside {
            display: block;
            width: 300px;
            height: 100%;
            max-height: calc(100vh - 90px - 60px); 
        }
    }

    .content {
        grid-column-start: 1;
    }

    @media (min-width: 918px) {
        .content {
            grid-column-start: 2;
        }
    }
</style>