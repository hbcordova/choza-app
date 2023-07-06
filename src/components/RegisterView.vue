<template>
    <form @submit="register">
        <p :class="[showError? 'error' : 'success']" v-if="showResult">{{ message }}</p>
        <div class="fields">
            <input v-model="user.email" 
                    v-on:blur="createUsername" 
                    name="email"
                    required 
                    class="field" 
                    type="email" 
                    pattern="^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$"
                    placeholder="Correo">
            <input disabled v-model="user.username" name="username" class="field" required type="text" placeholder="Username">
            <input v-model="user.password" name="password" minlength="6" maxlength="32" class="field" required type="password" placeholder="Password">
        </div>
        <div class="actions">
            <input class="btn btn-primary" type="submit" value="Registrarse">
            <input @click="goToLogin" class="btn btn-secondary" type="button" value="Iniciar sesión">
        </div>
    </form>
</template>

<script lang="ts" setup>
    import { ref } from 'vue';
    import UserSaveResource from '../models/userSaveResource';
    import { useAuthStore } from '../stores/auth';

    const emit = defineEmits(["changeSecurityView"]);
    const user = ref(new UserSaveResource('', '', '', 'CUSTOMER'));
    const message = ref('');
    const showError = ref(false);
    const showResult = ref(false);

    const auth = useAuthStore();

    const resetUserValues = () => {
        user.value.email = '';
        user.value.password = '';
        user.value.username = '';
    }
    
    const register = () => {
        event?.preventDefault();
        
        auth.register(user.value).then(
            () => {
                message.value = 'Successfully registered user!';
                showError.value = false;
                resetUserValues();
            },
            (error) => {
                showError.value = true;
                message.value = error.response.data
            }
        ).then(() => {
            showResult.value = true
            setTimeout(() => {
                showResult.value = false;
            }, 2000)
        });
        
    }
    const goToLogin = () => {
        emit("changeSecurityView");
    }
    const createUsername = () => {
        const position =  user.value.email.indexOf('@') === -1? user.value.email.length : user.value.email.indexOf('@');
        user.value.username = user.value.email.substring(0, position);
    }
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

    .success {
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
        font-size: 16px;
        background-color: var(--success);
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