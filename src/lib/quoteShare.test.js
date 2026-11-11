import { describe, expect, test } from 'bun:test';
import { buildGmailUrl, normaliseSaPhone } from './quoteShare';

describe('quote sharing', () => {
  test('local 0 numbers become 27', () => {
    expect(normaliseSaPhone('073 444 4740')).toBe('27734444740');
  });
  test('existing +27 numbers are kept', () => {
    expect(normaliseSaPhone('+27 (73) 444-4740')).toBe('27734444740');
  });
  test('missing or short numbers are rejected', () => {
    expect(normaliseSaPhone('')).toBeNull();
    expect(normaliseSaPhone('12345')).toBeNull();
  });
  test('gmail compose link carries recipient and subject', () => {
    const url = buildGmailUrl('a@b.co', 'Your Travel Affordable Getaway Quotation – Durban', 'Hi\nThere');
    expect(url.startsWith('https://mail.google.com/mail/?view=cm&fs=1&to=a%40b.co')).toBe(true);
    expect(url).toContain('body=Hi%0AThere');
  });
});