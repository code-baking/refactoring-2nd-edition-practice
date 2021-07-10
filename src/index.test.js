import statement from './index.js';
import { invoices, plays } from './fixtures.js';
import { expect } from '@jest/globals';

describe('statement', () => {
  it('Test', () => {
    console.log = jest.fn();

    invoices.forEach((invoice) => {
      console.log(statement(invoice, plays));
      console.log('------------------------------------------');
    });
    
    const result = `
    Statement for BigCo
    Hamlet: $650.00 (55석)
    As You Like It: $580.00 (35석)
    Othello: $500.00 (40석)
    총액: $1,730.00
    적립 포인트: 47점
    `
    
    expect(console.log).toHaveBeenCalledWith('------------------------------------------');
    expect(console.log.mock.calls[0][0].replace(/\s/g, "")).toBe(result.replace(/\s/g, ""))
  });
});
