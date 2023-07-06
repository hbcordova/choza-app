<template>
    <div class="schedule__table">
        <div class="header-container">
            <div class="header-table">
                <h2>Cronograma de Pagos</h2>
                <span>Metodo Frances Vencido Ordinario</span>
            </div>
            <button class="btn btn-export" @click="exportarExcel()">
                <ExcelIcon class="mr-2" />
                <span>Exportar</span>
            </button>
        </div>
        <v-table fixed-header height="600px">
            <thead>
                <tr>
                    <th>Mes</th>
                    <th>Periodo</th>
                    <th>Saldo Inicial</th>
                    <th>Intereses</th>
                    <th>Cuota</th>
                    <th>Amortización</th>
                    <th>Saldo Final</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="pago in cronograma">
                    <td>{{ pago.mes }}</td>
                    <td :class="{'gracia-parcial': pago.tipoPeriodo === 'P', 'gracia-total': pago.tipoPeriodo === 'T', 'gracia-normal': pago.tipoPeriodo === 'S', 'align-center': true}">{{ pago.tipoPeriodo }}</td>
                    <td>{{ Intl.NumberFormat("us-EN").format(Number(Math.abs(pago.saldoInicial).toFixed(2))) }}</td>
                    <td>{{ Intl.NumberFormat("us-EN").format(Number(Math.abs(pago.intereses).toFixed(2))) }}</td>
                    <td>{{ Intl.NumberFormat("us-EN").format(Number(Math.abs(pago.cuota).toFixed(2))) }}</td>
                    <td>{{ Intl.NumberFormat("us-EN").format(Number(Math.abs(pago.amortizacion).toFixed(2))) }}</td>
                    <td>{{ Intl.NumberFormat("us-EN").format(Number(Math.abs(pago.saldoFinal).toFixed(2))) }}</td>
                </tr>
            </tbody>
        </v-table>
    </div>
    <div class="financial__indicators">
        <h3 class="financial__indicators-title">Indicadores Financieros:</h3>
        <div :class="['indicator', indicatorWithColors(Number(van.toFixed(2)))]">
            <p>VAN: {{ Number(van).toFixed(2) }}</p>
        </div>
        <div :class="['indicator', indicatorWithColors(tir)]">
            <p>TIR: {{ tir }}%</p>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import * as XLSX from 'xlsx';
    import ExcelIcon from './icons/ExcelIcon.vue';

    let {montoInicial, cuotaInicial, tasaEfectivaMensual, plazoAnios, periodosGraciaParciales, periodosGraciaTotales} = defineProps<{
        montoInicial: number,
        cuotaInicial: number,
        tasaEfectivaMensual: number,
        plazoAnios: number, 
        periodosGraciaParciales: number[],
        periodosGraciaTotales: number[]
    }>();

    const indicatorWithColors = (value: number) => {
        if (value === 0) return 'neutral';
        else if (value > 0) return 'positive';
        return 'negative';
    }

    const calcularCuotaMensual = (saldoPendiente: number, tasaEfectivaMensual: number, plazoMeses: number) => {
        const tasa = tasaEfectivaMensual / 100;
        const factor = tasa * Math.pow(1 + tasa, plazoMeses) / (Math.pow(1 + tasa, plazoMeses) - 1);
        return saldoPendiente * factor;
    }

    const calcularCronograma = (montoInicial: number, cuotaInicial: number, tasaEfectivaMensual: number, plazoAnios: number, periodosGraciaParciales: Array<number>, periodosGraciaTotales: Array<number>) => {
        const plazoMeses = plazoAnios * 12;
        const saldoPendiente = montoInicial - cuotaInicial;
    
        let cronograma = [];
        let saldoRestante = saldoPendiente;
        let periodoActualParcial = 0;
        let periodoActualTotal = 0;
        let saldoInicial = 0;
    
        for (let i = 1; i <= plazoMeses; i++) {
        const intereses = saldoRestante * (tasaEfectivaMensual / 100);
        let cuotaMensual = 0;
        let amortizacion = 0;
        let tipoPeriodo = 'S'; // Por defecto, periodo normal
    
        if (periodoActualParcial < periodosGraciaParciales.length && i === periodosGraciaParciales[periodoActualParcial]) {
            tipoPeriodo = 'P'; // Periodo de gracia parcial
            cuotaMensual = intereses;
            saldoInicial = saldoRestante;
            periodoActualParcial++;
        } else if (periodoActualTotal < periodosGraciaTotales.length && i === periodosGraciaTotales[periodoActualTotal]) {
            tipoPeriodo = 'T'; // Periodo de gracia total
            cuotaMensual = 0;
            saldoInicial = saldoRestante;
            saldoRestante += intereses;
            periodoActualTotal++;
        } else {
            cuotaMensual = calcularCuotaMensual(saldoRestante, tasaEfectivaMensual, plazoMeses - i + 1);
            amortizacion = cuotaMensual - intereses;
            saldoRestante -= amortizacion;
            saldoInicial = saldoRestante + amortizacion; 
        }
    
        cronograma.push({
            mes: i,
            tipoPeriodo: tipoPeriodo,
            saldoInicial: Math.abs(saldoInicial),
            intereses: Math.abs(intereses),
            cuota: Math.abs(cuotaMensual),
            amortizacion: Math.abs(amortizacion),
            saldoFinal: Math.abs(saldoRestante)
        });
        }
    
        return cronograma;
    }

    const calcularVAN = (cronogramaPagos: any, tasaInteres: number) => {
        let loan = -cronogramaPagos[0].saldoInicial; 

        console.log(tasaInteres);
        

        let futureValues = 0;        

        for (let i = 0; i < cronogramaPagos.length; i++) {
            const flujo = cronogramaPagos[i].cuota;
            
            const periodo = i + 1;
            futureValues += (flujo / Math.pow(1 + (tasaInteres / 100), periodo));           
        }
        
        return loan + futureValues ;
    }

    const calcularTIR = (cronogramaPagos: any, precision = 0.0001) => {
        let tir = 0;
        let van = 0;
        let vanAnterior = 0;
        let incremento = 0.1;

        do {
            vanAnterior = van;

            tir += incremento;
            van = calcularVAN(cronogramaPagos, tir);

            if ((van > 0 && vanAnterior < 0) || (van < 0 && vanAnterior > 0)) {
            incremento /= -10;
            }
        } while (Math.abs(van) > precision);

        return tir;
    }

    const exportarExcel = () => {
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(cronograma);
        XLSX.utils.book_append_sheet(wb, ws, 'Cronograma');
        XLSX.writeFile(wb, `cronograma_pagos.xlsx`);
    }

    let cronograma = calcularCronograma(montoInicial, cuotaInicial, tasaEfectivaMensual, plazoAnios, periodosGraciaParciales, periodosGraciaTotales);
    
    let van = calcularVAN(cronograma, tasaEfectivaMensual);

    let tir = calcularTIR(cronograma, 0.0001);
  

</script>

<style scoped>

    .header-table h2 {
        color: var(--gray-dark);
    }

    .header-table span {
        color: var(--gray-light);
    }

    .schedule__table {
        width: 100%;
    }

    .gracia-parcial {
      color: var(--info);
    }

    .gracia-total {
      color: var(--error);
    }

    .gracia-normal {
      color: var(--success);
    }

    .grid {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        padding: 4px;
    }

    .grid th {
        text-align: left;
    }

    .align-left {
        text-align: left;
    }

    .btn {
        border: 1px solid var(--gray-dark);
        height: 56px;
        border-radius: 4px;
        color: var(--gray-dark);
        padding: 8px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .btn-export {
        background-color: var(--excel);
        color: white;
    }

    .header-container {
        display: grid;
        grid-template-columns: calc(70% - 32px) 30%;
        column-gap: 32px;
        margin-bottom: 16px;
    }

    .btn-export:hover {
        background-color: var(--success);
    }

    .financial__indicators {
        margin-top: 32px;
    }

    .financial__indicators-title {
        color: var(--gray-dark);
    }

    .indicator {
        margin-top: 8px;
        padding: 8px;
        text-align: center;
        border-radius: 4px;
        font-weight: bold;
    }

    .positive {
        background-color: #86b892;
        color: var(--excel);
    }

    .negative {
        background-color: #de7b85;
        color: var(--error);
    }

    .neutral {
        background-color: #ffca97;
        color: var(--warning);
    }

</style>