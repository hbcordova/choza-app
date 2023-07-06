export default class EntitySaveResource {
    name: string = '';
    currency: string = 'PEN';
    amountMin: number | null = null;
    amountMax: number | null = null;
    deadlineMin: number | null = null;
    deadlineMax: number | null = null;
    annualRateType: string = 'EFECTIVA';
    annualRateMin: number | null = null;
    annualRateMax: number | null = null;
}