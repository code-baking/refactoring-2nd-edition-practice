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
    expect(console.log).toHaveBeenCalledWith('------------------------------------------');
  });
});
