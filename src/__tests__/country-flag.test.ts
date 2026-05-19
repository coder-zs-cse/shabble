import { describe, it, expect } from 'vitest';

// Inline the utility so this test has zero external deps
function countryCodeToFlag(code: string): string {
    return code
        .toUpperCase()
        .split('')
        .map(c => String.fromCodePoint(c.charCodeAt(0) + 127397))
        .join('');
}

describe('countryCodeToFlag', () => {
    it('converts US to the US flag emoji', () => {
        expect(countryCodeToFlag('US')).toBe('🇺🇸');
    });

    it('converts IN to the India flag emoji', () => {
        expect(countryCodeToFlag('IN')).toBe('🇮🇳');
    });

    it('converts GB to the UK flag emoji', () => {
        expect(countryCodeToFlag('GB')).toBe('🇬🇧');
    });

    it('handles lowercase input', () => {
        expect(countryCodeToFlag('us')).toBe('🇺🇸');
    });
});
