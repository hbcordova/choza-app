<template>
    <h1 class="title">{{ hello }} {{ age }}</h1>
    <button @click="cambiarAge()">Cambiar EDAD</button>
</template>

<style scoped>
    .title {
        text-align: center;
    }
</style>

<script lang="ts" setup>
    import { Ref } from 'vue';
    import { ref } from 'vue';

    const hello: string = "Hola";
    let age: Ref<number> = ref(20);

    const cambiarAge = () => {
        age.value += 1;
    }
</script>


