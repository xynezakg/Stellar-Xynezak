import { describe, it, expect } from 'vitest';
import { isValidStellarAddress } from '../utils/helpers';

describe('Stellar Address Validation', () => {
  it('validates a valid Stellar Testnet public key', () => {
    const validAddress = 'GALD6OS2OC6N44TNY5UBURWZAZEOBOKR5VJBB5TDFC3P6NLNFD6AVTVN';
    expect(isValidStellarAddress(validAddress)).toBe(true);
  });

  it('rejects an empty or null string', () => {
    expect(isValidStellarAddress('')).toBe(false);
    expect(isValidStellarAddress('   ')).toBe(false);
  });

  it('rejects an address with incorrect prefix', () => {
    // Secret keys start with 'S', not 'G'
    const secretKey = 'SBTYNZUXVUXODDX4K5V3M2A3QZXDGLF4Z6C2Y2E7X4K3P3E3P4Q4E5X6';
    expect(isValidStellarAddress(secretKey)).toBe(false);
  });

  it('rejects an address with incorrect length', () => {
    expect(isValidStellarAddress('GBTYNZUXVUXODDX4K5V3M2A3QZXDGLF4Z6C2Y2E7X4K3P3E3P4Q4')).toBe(false);
  });

  it('rejects random non-base32 characters', () => {
    expect(isValidStellarAddress('GBTYNZUXVUXODDX4K5V3M2A3QZXDGLF4Z6C2Y2E7X4K3P3E3P4Q4E5!!')).toBe(false);
  });
});
