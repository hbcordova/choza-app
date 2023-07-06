<template>
    <div class="aside-navigation">
        <div>
            <div class="box-user">
                <img src="../assets/user.svg" alt="User icon" />
                <span class="user-name">{{ user.username }}</span>
            </div>
            <div class="box-navigation">
                <div 
                    @click="goTo('home')" 
                    :class="[ 'navigation__item', navigation[0]? 'active' : 'no-active']">
                    <PropertyIcon class="logo" />
                    <span class="navigation__item-text">Propiedades</span>
                </div>
                <div 
                    @click="goTo('applications')" 
                    :class="[ 'navigation__item', navigation[1]? 'active' : 'no-active']">
                    <BellIcon class="logo" />
                    <span class="navigation__item-text">Solicitudes</span>
                </div>
                <div 
                    @click="goTo('entities')" 
                    :class="[ 'navigation__item', navigation[2]? 'active' : 'no-active']">
                    <BankIcon class="logo" />
                    <span class="navigation__item-text">Entidades Financieras</span>
            </div>
            </div>
        </div>
        <div class="close-sesion" @click="logout">
            <LogoutIcon class="logo" />
            <span class="close__sesion-text">Cerrar Sesión</span>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import PropertyIcon from '../components/icons/PropertyIcon.vue';
    import BellIcon from '../components/icons/BellIcon.vue';
    import BankIcon from '../components/icons/BankIcon.vue';
    import LogoutIcon from '../components/icons/LogoutIcon.vue';
    import { useAuthStore } from '../stores/auth';
    import { ref } from 'vue';
    import router from '../routes';

    const navigation = ref([true, false, false]);
    const user = useAuthStore();

    const goTo = (value: string) => {
      if (value === 'home') {
        navigation.value[0] = true;
        navigation.value[1] = false;
        navigation.value[2] = false;

         router.push('/home');
      } else if (value === 'applications'){
        navigation.value[0] = false;
        navigation.value[1] = true;
        navigation.value[2] = false;

         router.push('/home/applications');
      } else if (value === 'entities'){
        navigation.value[0] = false;
        navigation.value[1] = false;
        navigation.value[2] = true;

        router.push('/home/entities');
      }
    }

    const logout = () => {
        user.logout();
        router.push('/');
    }

    onMounted: {
        const currentRoute = router.currentRoute.value.name?.toString().toLowerCase();

        const myRoute = currentRoute? currentRoute : 'home';
        
        goTo(myRoute);
    }
</script>

<style scoped>

    .aside-navigation {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    
    .box-user {
        height: 224px;
        background-color: var(--primary-color);
        border-radius: 8px;
        padding: 24px;
        margin-bottom: 30px;

        display: flex;
        flex-direction: column;
        justify-content: end;
        align-items: center;
    }

    .user-name {
        margin-top: 20px;
        color: white;
        font-size: 20px;
        font-weight: bold;
    }

    .navigation__item {
        height: 60px;
        padding: 16px 20px;
        border: 1px solid var(--gray-light);
        text-decoration: none;

        display: flex;
        align-items: center;
    }

    .navigation__item:hover, .close-sesion:hover {
        cursor: pointer;
    }

    .close-sesion:hover * {
        color: red;
        fill: red;
    }

    .navigation__item:first-child {
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
    }

    .navigation__item:last-child {
        border-top: none;
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
    }

    .navigation__item:not(:first-child):not(:last-child) {
        border-top: 0;
    }

    .navigation__item-text {
        font-size: 18px;
        font-weight: 500;
        color: var(--gray-light);
    }

    .close-sesion {
        display: flex;
        align-items: center;
        padding: 16px 20px;

        height: 60px;
        border: 1px solid var(--gray-light);
        color: var(--gray-light);
        border-radius: 8px;
        font-size: 18px;
        font-weight: 500;
    }

    .logo {
        width: 24px;
        height: 24px;
        margin-right: 20px;
        fill: var(--gray-light);
    }

    .active * {
        color: var(--primary-color);
        fill: var(--primary-color);
    }

</style>