import { Keypair } from '@stellar/stellar-sdk';

/**
 * Validates a Stellar public key (56 characters starting with 'G').
 */
export function isValidStellarAddress(address: string): boolean {
  if (!address || typeof address !== 'string') return false;
  const trimmed = address.trim();
  if (trimmed.length !== 56 || !trimmed.startsWith('G')) return false;
  try {
    Keypair.fromPublicKey(trimmed);
    return true;
  } catch {
    return false;
  }
}

/**
 * Converts XLM amount (string or number) to stroops (i128 BigInt).
 * 1 XLM = 10,000,000 stroops
 */
export function xlmToStroops(xlm: string | number): bigint {
  const num = typeof xlm === 'string' ? parseFloat(xlm) : xlm;
  if (isNaN(num) || num <= 0) return 0n;
  return BigInt(Math.floor(num * 10_000_000));
}

/**
 * Converts stroops (BigInt, string, or number) to XLM string with 2 decimal places.
 */
export function stroopsToXlm(stroops: bigint | string | number): string {
  const num = typeof stroops === 'bigint' ? Number(stroops) : Number(stroops);
  if (isNaN(num) || num <= 0) return '0.00';
  return (num / 10_000_000).toFixed(2);
}

/**
 * Truncates a Stellar address for display (e.g., GABC...XYZ).
 */
export function formatAddress(address: string, startChars: number = 4, endChars: number = 4): string {
  if (!address) return '';
  if (address.length <= startChars + endChars) return address;
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

/**
 * Calculates progress percentage between current and target amounts.
 */
export function calculateProgressPercentage(current: string | number, target: string | number): number {
  const c = typeof current === 'string' ? parseFloat(current) : current;
  const t = typeof target === 'string' ? parseFloat(target) : target;
  if (isNaN(c) || isNaN(t) || t <= 0) return 0;
  return Math.min(100, Math.round((c / t) * 100));
}

/**
 * Formats timestamp into relative or human-readable format.
 */
export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}
