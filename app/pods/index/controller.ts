import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

type Payment = [string, number];

// prettier-ignore
const PAYMENT_NAMES = [
  'Отопление',
  'Услуги консьержки',
  'ГВС (ХВС для ГВС) ОДН',
  'Электрическая энергия (дневной тариф) (ОДН)',
  'Подогрев воды ОДН',
  'Электрическая энергия (ночной тариф) (ОДН)',
  'ХВС ОДН',
  'Содержание и текущий ремонт',
];

export default class Index extends Controller {
  @tracked agreedUponPayment = 37000;
  @tracked remainder = 0;
  @tracked repairsPrice = 546.92;

  @tracked bill = `КОММУНАЛЬНЫЕ УСЛУГИ
  Отопление Гкал 0,7236 Х 2290,21 1657,2 Х 1657,2 Х Х 1657,2 1657,2 Х
  Услуги консьержки шт 1 Х 450 450 Х 450 Х Х 450 450 Х
  ГВС (ХВС для ГВС) ОДН м3 Х 0,0905 38,6 X 3,49 3,49 Х Х 3,49 Х 3,49
  Электрическая энергия (дневной тариф) (ОДН) кВт Х 1,0409 4,93 X 5,13 5,13 Х Х 5,13 Х 5,13
  Подогрев воды ОДН Гкал Х 0,0054 2290,21 X 12,43 12,43 Х Х 12,43 Х 12,43
  Электрическая энергия (ночной тариф) (ОДН) кВт Х 0,4642 1,91 X 0,89 0,89 Х Х 0,89 Х 0,89
  ХВС ОДН м3 Х 0,0905 38,6 X 3,49 3,49 Х Х 3,49 Х 3,49
  Содержание и текущий ремонт м2 60,3 Х 33,61 2026,68 Х 2026,68 Х Х 2026,68 2026,68 Х`;

  @action
  updateAgreedUponPayment(event: Event): void {
    const target = event.target as HTMLInputElement;

    this.agreedUponPayment = parseFloat(target.value);
  }

  @action
  updateBill(event: Event): void {
    const target = event.target as HTMLInputElement;

    this.bill = target.value;
  }

  @action
  updateRepairsPrice(event: Event): void {
    const target = event.target as HTMLInputElement;

    this.repairsPrice = parseFloat(target.value);
  }

  @action
  updateRemainder(event: Event): void {
    const target = event.target as HTMLInputElement;

    this.remainder = parseFloat(target.value);
  }

  get payments(): Payment[] {
    const paymentsSplit = this.bill.split(/\s*\n+\s*/);

    return PAYMENT_NAMES.reduce((result, paymentName) => {
      const line = paymentsSplit.find((payment) => payment.startsWith(paymentName));

      if (line) {
        const valueStr = line.split(/\s+/).reverse()[2].replace(/,/g, '.');
        const price = parseFloat(valueStr);
        result.push([paymentName, price]);
      } else {
        result.push([paymentName, 0]);
      }

      return result;
    }, [] as Payment[]);
  }

  get sumPayments(): number {
    const resultRaw =
      this.payments.reduce((result, payment) => result + payment[1], 0) + this.repairsPrice;
    return Math.round(resultRaw * 100) / 100;
  }

  get result(): number {
    return this.agreedUponPayment - this.sumPayments + this.remainder;
  }

  get output(): string {
    return `Положил на карту ${this.agreedUponPayment - this.sumPayments} рублей. Это ${
      this.agreedUponPayment
    } за вычетом:

${this.payments.map(([name, price]) => `${name}\t${price}`).join('\n')}
Капремонт ${this.repairsPrice}

Итого ${this.sumPayments}

Остаток на карте с прошлого месяца: ${this.remainder}
Сумма на карте: ${this.result}`;
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your controllers.
declare module '@ember/controller' {
  interface Registry {
    index: Index;
  }
}
