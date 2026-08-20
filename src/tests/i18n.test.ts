import { describe, it, expect } from 'vitest';
import { translations } from '../utils/i18n';

describe('Bilingual Localization System (Tagalog & English)', () => {
  it('contains valid translation dictionaries for both EN and TL', () => {
    expect(translations.en).toBeDefined();
    expect(translations.tl).toBeDefined();
  });

  it('verifies essential UI string keys exist in both languages', () => {
    const keys: (keyof typeof translations.en)[] = [
      'brandSubtitle',
      'heroBadge',
      'heroHighlight',
      'tabDonate',
      'tabTelemetry',
      'tabOrganizer',
      'tabReceipts',
      'tabAnalytics',
      'tabUsers',
      'tabFeedback',
      'btnConnect',
      'btnDonateNow',
      'btnDisburse',
      'fundedLabel',
      'disbursedLabel',
    ];

    keys.forEach((k) => {
      expect(translations.en[k].length).toBeGreaterThan(0);
      expect(translations.tl[k].length).toBeGreaterThan(0);
    });
  });

  it('renders correct Tagalog translations for disaster response terminology', () => {
    expect(translations.tl.tabDonate).toBe('Mag-donate sa Escrow');
    expect(translations.tl.btnConnect).toBe('Ikonekta ang Wallet');
    expect(translations.tl.fundedLabel).toBe('KABUUANG PONDO SA ESCROW');
  });
});
