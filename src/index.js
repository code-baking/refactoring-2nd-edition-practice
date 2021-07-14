/* eslint-disable max-classes-per-file */
/* eslint-disable no-restricted-syntax */
import { invoices, plays } from './fixtures';

function playFor(performance) {
  return plays[performance.playID];
}

class PerformanceCalculator {
  constructor(performance) {
    this.play = playFor(performance);
    this.performance = performance;
  }

  get volumeCreditsFor() {
    return Math.max(this.performance.audience - 30, 0);
  }
}

class TragedyCalculator extends PerformanceCalculator {
  get amountFor() {
    const defaultAmount = 40000;

    if (this.performance.audience > 30) {
      return defaultAmount + (1000 * (this.performance.audience - 30));
    }

    return defaultAmount;
  }
}

class ComedyCalculator extends PerformanceCalculator {
  get amountFor() {
    const defaultAmount = 30000 + 300 * this.performance.audience;

    if (this.performance.audience > 20) {
      return defaultAmount + 10000 + 500 * (this.performance.audience - 20);
    }

    return defaultAmount;
  }

  get volumeCreditsFor() {
    return super.volumeCreditsFor + Math.floor(this.performance.audience / 5);
  }
}

function createPerformanceCalculator(perf) {
  switch (playFor(perf).type) {
    case 'tragedy':
      return new TragedyCalculator(perf);

    case 'comedy':
      return new ComedyCalculator(perf);

    default:
      throw new Error();
  }
}

export default function statement(invoice, plays) {
  // 전체 공연료
  let totalAmount = 0;

  // 포인트
  let volumeCredits = 0;

  let result = `Statement for ${invoice.customer}\n`;

  const { format } = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFactionDigits: 2,
  });

  for (const perf of invoice.performances) {
    const calculator = createPerformanceCalculator(perf);

    // 포인트를 적립한다.
    volumeCredits += calculator.volumeCreditsFor;
  }

  for (const perf of invoice.performances) {
    const play = playFor(perf);

    const calculator = createPerformanceCalculator(perf);

    // 공연료
    const thisAmount = calculator.amountFor;

    // 청구 내역을 출력한다
    result += ` ${play.name}: ${format(thisAmount / 100)} (${perf.audience
    }석)\n`;
  }

  for (const perf of invoice.performances) {
    const calculator = createPerformanceCalculator(perf);

    // 공연료
    const thisAmount = calculator.amountFor;

    totalAmount += thisAmount;
  }

  result += `총액: ${format(totalAmount / 100)}\n`;
  result += `적립 포인트: ${volumeCredits}점\n`;

  return result;
}

invoices.forEach((invoice) => {
  console.log(statement(invoice, plays));
  console.log('------------------------------------------');
});
