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
  const { format } = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFactionDigits: 2,
  });

  const volumeCredits = invoice.performances.reduce(
    (acc, performance) => {
      const calculator = createPerformanceCalculator(performance);

      return acc + calculator.volumeCreditsFor;
    },
    0,
  );

  const result = invoice.performances.reduce((acc, performance) => {
    const play = playFor(performance);

    const calculator = createPerformanceCalculator(performance);

    const thisAmount = calculator.amountFor;

    return `${acc} ${play.name}: ${format(thisAmount / 100)} (${performance.audience
    }석)\n`;
  }, `Statement for ${invoice.customer}\n`);

  const totalAmount = invoice.performances.reduce((acc, performance) => {
    const calculator = createPerformanceCalculator(performance);

    const thisAmount = calculator.amountFor;

    return acc + thisAmount;
  }, 0);

  return `${result}총액: ${format(totalAmount / 100)}\n적립 포인트: ${volumeCredits}점\n`;
}

invoices.forEach((invoice) => {
  console.log(statement(invoice, plays));
  console.log('------------------------------------------');
});
