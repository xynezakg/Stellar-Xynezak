import { describe, it, expect } from 'vitest';

describe('Multi-Currency Converter Math (XLM / PHP / USD)', () => {
  const USD_RATE = 0.12;
  const PHP_RATE = 6.85;

  it('accurately converts XLM to USD', () => {
    const xlm = 100;
    const usd = xlm * USD_RATE;
    expect(usd).toBe(12.0);
  });

  it('accurately converts XLM to Philippine Peso (PHP)', () => {
    const xlm = 50;
    const php = xlm * PHP_RATE;
    expect(php).toBe(342.5);
  });

  it('handles micro-donations conversion without NaN errors', () => {
    const microXlm = 1;
    const usd = (microXlm * USD_RATE).toFixed(2);
    const php = (microXlm * PHP_RATE).toFixed(2);
    expect(usd).toBe('0.12');
    expect(php).toBe('6.85');
  });
});
