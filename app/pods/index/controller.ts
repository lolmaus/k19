import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

type Payment = [string, number];

const PAYMENT_NAMES = [
  'Электричество на ОДН Т-1',
  'Электричество на ОДН Т-2',
  'Подогрев ГВС ОДН',
  'ХВС ОДН',
  'ХВС для ГВС ОДН',
  'Услуги консьержей',
  'Содержание и ремонт жилых помещений',
  'Отопление',
];

export default class Index extends Controller {
  @tracked agreedUponPayment = 37000;
  @tracked remainder = 0;
  @tracked repairsPrice = 546.92;

  @tracked bill = `ХВС для ГВС	м3	38.6	5.472	211.22	0.00	0.00	211.22
  Электричество на ОДН Т-1	кВт.ч	4.61	24.76	114.15	0.00	0.00	114.15
  Электричество на ОДН Т-2	кВт.ч	1.76	11.33	19.94	0.00	0.00	19.94
  Отопление	Гкал	2199.94	0.7839	1 724.53	0.00	0.00	1 724.53
  Обращение с ТКО	м2	949.56	0.5729	544.00	0.00	0.00	544.00
  Подогрев ХВС для нужд ГВС	Гкал	2199.94	0.327773	721.08	0.00	0.00	721.08
  Подогрев ГВС ОДН	Гкал	2199.94	0.005421	11.93	0.00	0.00	11.93
  ХВС ОДН	м3	38.6	0.0905	3.49	0.00	0.00	3.49
  ХВС для ГВС ОДН	м3	38.6	0.0905	3.49	0.00	0.00	3.49
  Холодное водоснабжение	м3	38.6	7.524	290.43	0.00	0.00	290.43
  Услуги консьержей	шт	450	1	450.00	0.00	0.00	450.00
  Содержание и ремонт жилых помещений	м2	36.45	60.3	2 026.68	0.00	0.00	2 026.68
  Водоотведение	м3	36.11	12.996	469.28	0.00	0.00	469.28`;

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
    return this.bill
      .split(/\n+/)
      .map(
        (str): Payment => {
          const [name, ...numbers] = str.trim().split(/\t+/);
          const price = parseFloat(numbers[numbers.length - 1].replace(/\s+/g, ''));
          return [name, price];
        }
      )
      .filter((payment: Payment) => PAYMENT_NAMES.includes(payment[0]));
  }

  get sumPayments(): number {
    return this.payments.reduce((result, payment) => result + payment[1], 0) + this.repairsPrice;
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
