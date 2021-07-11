import statement from './index.js';
import { invoices, plays } from './fixtures.js';
import { expect } from '@jest/globals';

const wanted =
  `Statement for BigCo
 Hamlet: $650.00 (55석)
 As You Like It: $580.00 (35석)
 Othello: $500.00 (40석)
총액: $1,730.00
적립 포인트: 47점
`;

describe('statement', () => {
  describe('With type value', () => {
    it('Test', () => {
      const result = invoices.reduce((acc, invoice) => {
        return acc += statement(invoice, plays);
      }, '');
      expect(result).toBe(wanted);
    });
  });
});
