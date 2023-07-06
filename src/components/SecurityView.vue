<template>
    <div class="bg">
        <div class="login">
            <div class="image">
                <SearchHouse></SearchHouse>
            </div>
            <div class="panel">
                <div class="logo">
                    <ChozaLogo></ChozaLogo>
                </div>
                <div class="form">
                    <div v-if="activeRegister">
                        <RegisterView v-on:change-security-view="changeView"></RegisterView>
                    </div>
                    <div v-else>
                        <LoginView v-on:change-security-view="changeView"></LoginView>
                    </div>
                </div>
            </div>
        </div>
        <!-- <NuevoComponent /> -->
    </div>
</template>

<script lang="ts" setup>
    import ChozaLogo from './icons/ChozaLogo.vue';
    import SearchHouse from './icons/SearchHouse.vue';
    
    import LoginView from './LoginView.vue';
    // import NuevoComponent from './NuevoComponent.vue';
    import RegisterView from './RegisterView.vue';
    import { ref } from 'vue';

    const activeRegister = ref(false);

    const changeView = () => {
        activeRegister.value =  !activeRegister.value;
    }

</script>

<style scoped>

    .d-none {
        display: none;
    }

    .d-block {
        display: block;
    }

    .bg {
        width: 100vw;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;

        background: linear-gradient(90deg, rgba(206,103,255,1) 0%, rgba(171,66,253,1) 100%);
    }

    .login {
        max-width: 890px;
        width: 95%;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        border-radius: 8px;
    }

    .image {
        background-color: rgba(222, 180, 255, .2);
        display: flex;
        justify-content: center;
        align-items: center;
        border-top-left-radius: 8px;
        border-bottom-left-radius: 8px;
    }

    @media(max-width: 764px) {

        .login {
            grid-template-columns: repeat(1, 1fr);
        }
        .image {
            display: none;
        }
    }

    .panel {
        padding: 100px 72px 70px 73px;
        background-color: white;
        border-top-right-radius: 8px;
        border-bottom-right-radius: 8px;
    }

    .logo {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 34px;
    }

    .fields {
        display: flex;
        flex-direction: column;
        justify-content: center;
        row-gap: 16px;
        margin-bottom: 59px;
    }

    .field {
        padding: 15px 30px;
        font-size: 18px;
        border: 2px solid #D9D9D9;
        border-radius: 4px;
    }

    .field::placeholder {
        color: #D9D9D9;
    }

    .field:focus {
        outline-color: var(--primary-color);
    }

    .actions {
        display: flex;
        flex-direction: column;
        row-gap: 16px;
    }

    .btn {
        border-radius: 4px;
    }

    .btn-primary {
        color: white;
        background-color: var(--primary-color);
        font-size: 20px;
        padding: 16px 0;
        border: none;
    }

    .btn-primary:hover {
        background-color: var(--seconday-color);
        cursor: pointer;
    }

    .btn-secondary {
        color: var(--primary-color);
        background-color: transparent;
        font-size: 20px;
        border: none;
        cursor: pointer;
    }
</style>