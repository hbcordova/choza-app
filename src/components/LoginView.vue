<template>
    <form @submit="login">
        <p class="error" v-if="showError">{{ message }}</p>
        <div class="fields">
            <input 
                v-model="user.email" 
                pattern="^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$"
                required
                class="field txt-email" 
                type="text" 
                placeholder="Correo">
            <input 
                v-model="user.password" 
                class="field txt-password" 
                type="password"
                minlength="6" 
                maxlength="32"
                required
                placeholder="Password">
        </div>
        <div class="actions">
            <input class="btn btn-primary" type="submit" value="Iniciar Sesión">
            <input @click="goToRegister" class="btn btn-secondary" type="button" value="Crear una cuenta">
        </div>
    </form>
</template>

<script lang="ts" setup>
    import { ref } from 'vue';
    import UserLoginResource from '../models/userLoginResource';
    import { useAuthStore } from '../stores/auth';
    import router from '../routes';
    import { onMounted } from 'vue';

    const authStore = useAuthStore();
    const user = ref(new UserLoginResource('', ''));
    const showError = ref(false);
    const message = ref('');

    const emit = defineEmits(["changeSecurityView"]);

    const login = () => {
        event?.preventDefault();
        
        authStore.login(user.value).then(
            async () => {
                await router.push('/home').catch(() => {{}});
            },
            (error) => {
                showError.value = true;
                setTimeout(() => {
                    showError.value = false;
                }, 2000)
                message.value = error.response.data;
            }
        );
    }

    const goToRegister = () => {
        emit("changeSecurityView");
    }

    onMounted(() => {
        const user = useAuthStore();

        if (user.isLogged()) router.push('/home');
    })
</script>

<style scoped>

    .error {
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
        font-size: 16px;
        background-color: var(--error);
        padding: 2px;
        border-radius: 4px;
        margin-bottom: 8px;
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