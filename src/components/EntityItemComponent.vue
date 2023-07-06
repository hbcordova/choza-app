<template>
    <div class="entity">
        <div class="panel">
            <div class="content">
                <span class="content__title">{{ entity.name }}</span>
                <div class="content__actions">
                    <div v-if="useAuth.isAdmin()" :class="['btn']" @click="emitDelete(entity.id)">
                        <TrashIcon class="logo" />
                    </div>
                    <div :class="['btn']" @click="expandPanel">
                        <ArrowDownIcon class="logo" />
                    </div>
                </div>
            </div>
            <div :class="['expand', isOpen? 'open' : 'no-open']">
                <p>Monto: {{ Intl.NumberFormat('en-US').format(entity.amountMin)  }} - {{ Intl.NumberFormat('en-US').format(entity.amountMax)  }} ({{ entity.currency }})</p>
                <p>Tasa de Interes Efectiva Referencial: {{ entity.annualRateMin }}% - {{ entity.annualRateMax }}%</p>
                <p>Plazo: {{ entity.deadlineMin }} - {{ entity.deadlineMax }} años</p>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import TrashIcon from './icons/TrashIcon.vue';
    import ArrowDownIcon from './icons/ArrowDownIcon.vue';
    import { ref } from 'vue';
    import { useAuthStore } from '../stores/auth';

    let isOpen = ref(false);
    const { entity } = defineProps(["entity"]);
    const emit = defineEmits<{(e: 'removeItem', id: number): void}>();

    let useAuth = useAuthStore();

    const expandPanel = () => {
        isOpen.value = !isOpen.value;
    }

    const emitDelete = (id: number) => {
        emit('removeItem', id);
    }

</script>

<style scoped>

    .entity {
        margin-bottom: 8px;
    }

    .panel {
        border: 1px solid var(--gray-light);
        padding: 19px 32px;
        border-radius: 8px;
    }

    .expand {
        padding-top: 10px;
    }

    .expand p {
        font-size: 18px;
        font-weight: 500;
    }

    .panel:hover {
        cursor: pointer;
    }

    .open {
        display: block;
    }

    .no-open {
        display: none;
    }

    .content {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .content__title {
        font-size: 18px;
        font-weight: 500;
        color: black
    }

    .content__actions {
        display: flex;
        columns: 16px;
    }

    .btn {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 8px;
    }

    .btn:hover {
        cursor: pointer;
        background-color: var(--gray-dark);
    }

    .btn:hover .logo {
        fill: white;
    }

    .logo {
        width: 24px;
        fill: var(--gray-dark);
    }
</style>